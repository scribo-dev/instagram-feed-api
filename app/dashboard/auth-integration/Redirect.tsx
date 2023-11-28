"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function Redirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  useEffect(() => {
    if (!window.location.hash) return;

    const params = new URLSearchParams(window.location.hash.replace("#", ""));
    const searchParams = new URLSearchParams();
    const longLivedToken = params.get("long_lived_token");
    const accessToken = params.get("access_token");
    if (longLivedToken) searchParams.set("long_lived_token", longLivedToken);

    if (accessToken) searchParams.set("access_token", accessToken);

    router.push(`/dashboard/account-selector?${searchParams.toString()}`);
  }, [router, searchParams]);

  return null;
}
