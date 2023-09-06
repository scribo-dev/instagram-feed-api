import { NextRequest } from "next/server";

import cors from "../../../cors";

import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import { prisma } from "@/lib/db";
import { getWorkflowClient } from "@/lib/temporal";
import { kv } from "@/lib/cache";
import { Prisma } from "@prisma/client";

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

async function checkPermission(
  request: NextRequest,
  account: string,
  checkAccount: boolean = true
) {
  const auth = request.headers.get("Authorization")?.replace("Bearer ", "");
  if (!auth)
    return {
      error: "Token not found",
    };

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

/**
 * @swagger
 * /api/v2/{account}:
 *   get:
 *     description: Returns user's instagram media
 *     parameters:
 *      - name: account
 *        in: path
 *        description: Instagram account name
 *        required: true
 *        schema:
 *          type: string
 *      - name: media-type
 *        in: query
 *        description: filter by media type
 *        required: false
 *        schema:
 *          type: string
 *          enum:
 *            - CAROUSEL_ALBUM
 *            - IMAGE
 *            - VIDEO
 *      - name: media-product-type
 *        in: query
 *        description: filter by media product type
 *        required: false
 *        schema:
 *          type: string
 *          enum:
 *            - AD
 *            - FEED
 *            - STORY
 *            - REELS
 *      - name: limit
 *        in: query
 *        description: number of media returned
 *        required: false
 *        schema:
 *          type: integer
 *      - name: page
 *        in: query
 *        description: page number
 *        required: false
 *        schema:
 *          type: integer
 *     security:
 *      - BearerAuth:
 *     responses:
 *       401:
 *        description: Unauthorized
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Error'
 *       200:
 *         description: List of all media types
 *         content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  data:
 *                    type: array
 *                    items:
 *                      $ref: '#/components/schemas/Media'
 *                  pagination:
 *                    $ref: '#/components/schemas/Pagination'
 */
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
  const limit = parseInt(url.searchParams.get("limit") || "10");
  const page = parseInt(url.searchParams.get("page") || "1");
  const mediaType = url.searchParams.get("media-type")?.toUpperCase() as
    | "CAROUSEL_ALBUM"
    | "IMAGE"
    | "VIDEO"
    | null;

  const mediaProductType = url.searchParams
    .get("media-product-type")
    ?.toUpperCase() as "AD" | "FEED" | "STORY" | "REELS" | null;

  const { account: instagramAccount, error } = await checkPermission(
    request,
    params.account
  );

  if (error)
    return cors(
      request,
      new Response(JSON.stringify({ error }), {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      })
    );

  const account = params.account;
  let query: Prisma.MediaWhereInput = { username: account };
  if (mediaType) query = { ...query, mediaType };

  if (mediaProductType) query = { ...query, mediaProductType };

  const images = await prisma.media.findMany({
    where: query,
    orderBy: { timestamp: "desc" },
    skip: (page - 1) * limit,
    take: limit,
  });
  const totalCount = await prisma.media.count({ where: query });
  const pageCount = Math.ceil(totalCount / limit);
  const previousPage = page > 1 ? page - 1 : null;
  const nextPage = page < pageCount ? page + 1 : null;
  const pagination = {
    isFirstPage: previousPage === null,
    isLastPage: nextPage === null,
    currentPage: page,
    previousPage,
    nextPage,
    pageCount,
    totalCount,
    limit,
  };

  const cacheKey = `${account}-temporal-ttl`;
  const keyTTL = await kv.ttl(cacheKey);
  const forceNoCache = request.headers.get("Cache-Control") === "no-cache";

  if (keyTTL <= -1 || forceNoCache) {
    try {
      const client = await getWorkflowClient();
      await client.start("InstagramInterpreter", {
        args: [account, sizes, quality],
        taskQueue: "instagram-interpreter",
        workflowId: `instagram-${account}`,
      });

      await kv.set(cacheKey, "cached");
      await kv.expire(cacheKey, 5 * 60);
    } catch (e) {
      console.error(e);
    }
  }

  return cors(
    request,
    new Response(JSON.stringify({ data: images, pagination }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    })
  );
}

/**
 * @swagger
 * /api/v2/{account}:
 *   post:
 *     description: Add instagram account
 *     parameters:
 *      - name: account
 *        in: path
 *        description: Instagram account name
 *        required: true
 *        schema:
 *          type: string
 *     security:
 *      - BearerAuth:
 *     responses:
 *       401:
 *        description: Unauthorized
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Error'
 *       200:
 *         description: Login information that you need to send to the client
 *         content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/LoginURL'
 */
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
        url: `https://www.facebook.com/v17.0/dialog/oauth?client_id=${process.env.FB_CLIENT_ID}&display=page&extras={"setup":{"channel":"IG_API_ONBOARDING"}}&redirect_uri=${process.env.APP_URL}/auth-integration&response_type=token&scope=instagram_basic,instagram_content_publish,instagram_manage_comments,instagram_manage_insights,pages_show_list,pages_read_engagement`,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
  );
}

/**
 * @swagger
 * /api/v2/{account}:
 *   delete:
 *     description: Remove instagram account
 *     parameters:
 *      - name: account
 *        in: path
 *        description: Instagram account name
 *        required: true
 *        schema:
 *          type: string
 *     security:
 *      - BearerAuth:
 *     responses:
 *       401:
 *        description: Unauthorized
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Error'
 *       200:
 *         description: Account removed from auth token
 *
 */
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

  await prisma.apiToken.update({
    where: { id: token.id },
    data: {
      accounts: {
        disconnect: {
          username,
        },
      },
    },
  });

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
