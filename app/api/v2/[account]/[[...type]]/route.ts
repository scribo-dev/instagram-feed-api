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

export const revalidate = 360;

async function checkPermission(
  request: NextRequest,
  account: string,
  checkAccount: boolean = true
) {
  const auth = request.headers.get("Authorization")?.replace("Bearer ", "");
  let storedToken = await prisma.apiToken.findUnique({
    where: { id: auth },
    include: { accounts: true },
  });

  if (!storedToken)
    return {
      error: "Token not found",
    };

  const instagramAccount = storedToken.accounts.find(
    (a) => a.username === account
  );
  if (checkAccount && !instagramAccount)
    return {
      error: "Invalid account",
    };

  return { account: instagramAccount, token: storedToken };
}

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: { account: string; type?: string };
  }
) {
  const url = new URL(request.url);
  const sizes = url.searchParams.get("sizes");
  const quality = url.searchParams.get("quality");
  const { account: instagramAccount, error } = await checkPermission(
    request,
    params.account
  );

  if (error) return cors(request, new Response(error, { status: 401 }));

  const account = params.account;
  const requestingStories =
    params.type?.length !== 0 && params.type?.at(0) === "stories";

  // const key = requestingStories ? `${account}-stories` : account;
  // let images: InstagramImage[] =
  // await kv.lrange(key, 0, 12);
  let images = await prisma.media.findMany({
    where: { username: account },
    orderBy: { timestamp: "desc" },
  });

  try {
    const client = await getWorkflowClient();
    await client.start("InstagramInterpreter", {
      args: [account, sizes, quality],
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
      // headers,
    })
  );
}

export async function POST(
  request: NextRequest,
  {
    params,
  }: {
    params: { account: string; type?: string };
  }
) {
  const {
    account: instagramAccount,
    token,
    error,
  } = await checkPermission(request, params.account, false);

  if (error || !token)
    return cors(request, new Response(error, { status: 401 }));

  await prisma.apiToken.update({
    where: { id: token.id },
    data: {
      accounts: {
        connectOrCreate: {
          where: { username: params.account },
          create: { username: params.account },
        },
      },
    },
  });

  return cors(
    request,
    new Response(
      JSON.stringify({
        loginUrl: `https://www.facebook.com/v17.0/dialog/oauth?client_id=${process.env.FB_CLIENT_ID}&display=page&extras={"setup":{"channel":"IG_API_ONBOARDING"}}&redirect_uri=${process.env.APP_URL}/auth-integration&response_type=token&scope=instagram_basic,instagram_content_publish,instagram_manage_comments,instagram_manage_insights,pages_show_list,pages_read_engagement`,
      }),
      { status: 200 }
    )
  );
}

export async function DELETE(
  request: NextRequest,
  {
    params,
  }: {
    params: { account: string; type?: string };
  }
) {
  const {
    account: instagramAccount,
    token,
    error,
  } = await checkPermission(request, params.account, false);

  if (error || !token || !instagramAccount)
    return cors(request, new Response(error, { status: 401 }));

  const username = instagramAccount.username;

  await kv.del(username);
  await kv.del(`${username}-stories`);
  return cors(request, new Response(null, { status: 200 }));
}

export async function OPTIONS(request: Request) {
  return cors(
    request,
    new Response(null, {
      status: 204,
    })
  );
}
