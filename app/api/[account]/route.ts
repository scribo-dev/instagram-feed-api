import { scrape } from "./scrape";
import { NextResponse } from "next/server";

export const runtime = "edge";

// export const revalidate = 60 * 5;

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: { account: string };
  }
) {
  let images = await scrape(params.account);

  return new Response(JSON.stringify(images), {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
