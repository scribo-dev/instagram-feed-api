import { NextRequest } from "next/server";

import cors from "../../../../cors";

import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import { prisma } from "@/lib/db";
import { InstagramImage } from "@/lib/utils";
import { getWorkflowClient } from "@/lib/temporal";
import { kv } from "@/lib/cache";

if (!process.env.KV_URL || !process.env.KV_TOKEN) throw "env not found";

const redis = new Redis({
  url: process.env.KV_URL,
  token: process.env.KV_TOKEN,
});

const ratelimit = {
  free: new Ratelimit({
    redis,
    analytics: true,
    prefix: "ratelimit:free",
    limiter: Ratelimit.fixedWindow(5, "10s"),
  }),
  paid: new Ratelimit({
    redis,
    analytics: true,
    prefix: "ratelimit:paid",
    limiter: Ratelimit.fixedWindow(1000, "10s"),
  }),
};

export const revalidate = 60 * 5;

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: { account: string; type?: string };
  }
) {
  const auth = request.headers.get("Authorization")?.replace("Bearer ", "");
  let storedToken = await prisma.apiToken.findUnique({
    where: { id: auth },
    include: { accounts: true },
  });

  if (!storedToken) return cors(request, new Response("", { status: 401 }));

  const instagramAccount = storedToken.accounts.find(
    (a) => a.username === params.account
  );
  if (!instagramAccount)
    return cors(request, new Response("Invalid account", { status: 401 }));

  let id = request.ip ?? "anonymous";
  let rate = ratelimit.free;

  if (auth) {
    rate = ratelimit.paid;
    id = auth;
  }

  const { success, remaining, limit, reset } = await rate.limit(
    id ?? "anonymous"
  );

  let headers = {
    "Content-Type": "application/json",
    "X-RateLimit-Limit": limit.toString(),
    "X-RateLimit-Remaining": remaining.toString(),
    "X-RateLimit-Reset": reset.toString(),
  };

  if (!success)
    return cors(request, new Response("", { status: 429, headers }));

  const account = params.account;
  const requestingStories =
    params.type?.length !== 0 && params.type?.at(0) === "stories";

  const key = requestingStories ? `${account}-stories` : account;
  let images: InstagramImage[] = await kv.lrange(key, 0, 12);

  try {
    const client = await getWorkflowClient();
    await client.start("InstagramInterpreter", {
      args: [account],
      taskQueue: "instagram-interpreter",
      workflowId: `instagram-${account}`,
    });
  } catch (e) {
    console.error(e);
  }

  return cors(
    request,
    new Response(JSON.stringify(images), {
      status: 200,
      headers,
    })
  );
}

export async function OPTIONS(request: Request) {
  return cors(
    request,
    new Response(null, {
      status: 204,
    })
  );
}
