"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function Redirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  useEffect(() => {
    if (!window.location.hash) return;

    const params = new URLSearchParams(window.location.hash.replace("#", ""));
    router.push(
      `/account-selector?long_lived_token=${params.get(
        "long_lived_token"
      )}&access_token=${params.get("access_token")}`
    );
  }, [router, searchParams]);

  return null;
}
