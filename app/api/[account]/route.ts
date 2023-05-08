import { scrape } from "./scrape";
import { NextResponse } from "next/server";

export const runtime = "edge";

export const revalidate = 60 * 5;

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: { account: string };
  }
) {
  let images = await scrape(params.account);

  return NextResponse.json(images);
  // return new Response(JSON.stringify(images), {
  //   status: 200,
  //   headers: {
  //     "content-type": "application/json",
  //     "cache-control": "public, s-maxage=1200, stale-while-revalidate=600",
  //   },
  // });
}
