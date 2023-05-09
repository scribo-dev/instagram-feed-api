"use server";

import { redirect } from "next/navigation";

export async function GenerateFeed(data: FormData) {
  let account = data.get("account") as string;
  if (!account) throw new Error("Account not provided");

  redirect(`/${account.replace("@", "").trim()}`);
}
