// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

// const chromium = require("chrome-aws-lambda");
import playwright from "playwright-core";

type Data = {
  images: string[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  let browser;
  // if (process.env.NODE_ENV !== "development") {
  //   browser = await playwright.chromium.launch({
  //     args: chromium.args,
  //     executablePath: await chromium.executablePath,

  //     headless: chromium.headless,
  //   });
  // } else {
  //   browser = await playwright.chromium.launch({
  //     headless: true,
  //   });
  // }
  browser = await playwright.chromium.launch({
    headless: true,
  });
  // Open a new page / tab in the browser.
  const page = await browser.newPage({
    bypassCSP: true, // This is needed to enable JavaScript execution on GitHub.
  });
  // Tell the tab to navigate to the JavaScript topic page.
  await page.goto("https://instagram.com/webbyinternet");
  // Pause for 10 seconds, to see what's going on.
  // await page.waitForTimeout(10000);
  await page.waitForSelector("._aagv img");
  // Turn off the browser to clean up after ourselves.
  let images: string[] = await page.$$eval("._aagv img", (selected: any) => {
    return selected.map((i: any) => i.src);
  });

  await browser.close();

  res
    .setHeader(
      "Cache-Control",
      "public, s-maxage=10, stale-while-revalidate=59"
    )
    .status(200)
    .json({ images });
}
