import { scrape } from "./scrape";
import { NextResponse } from "next/server";

export const runtime = "edge";

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
}
