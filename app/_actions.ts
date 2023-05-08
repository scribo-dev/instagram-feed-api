"use server";

import { redirect } from "next/navigation";

export async function GenerateFeed() {
  console.log("test from server");

  redirect("/teste");
}
