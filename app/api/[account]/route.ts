import { NextResponse } from "next/server";

import { scrape } from "./scrape";
import cors from "../../cors";

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

  return cors(
    request,
    new Response(JSON.stringify(images), {
      status: 200,
      headers: { "Content-Type": "application/json" },
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
