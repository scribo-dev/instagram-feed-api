import { NextRequest } from "next/server";
import { ipAddress } from "@vercel/functions";

import cors from "../../cors";
import { scrape } from "@/lib/scrape";

import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

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

const clients = [
  "935d304b135df1cbb5c5ee1fe191bfb1", // Scribo
  "907eb8cece1b1c7a3f2ab59533041de9", // Black Swan
];

export const maxDuration = 300;

export async function GET(
  request: NextRequest,
  props: {
    params: Promise<{ account: string }>;
  }
) {
  const params = await props.params;
  const auth = request.headers.get("Authorization")?.replace("Bearer ", "");
  let id = ipAddress(request) ?? "anonymous";
  let rate = ratelimit.free;

  if (auth && clients.includes(auth)) {
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

  let images = await scrape(params.account);

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
