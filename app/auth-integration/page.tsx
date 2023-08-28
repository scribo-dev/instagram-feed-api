"use client";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useEffect } from "react";

export default async function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!window.location.hash) return;

    const params = new URLSearchParams(window.location.hash);
    router.push(
      `/account-selector?long_lived_token=${params.get("long_lived_token")}`
    );
  }, [searchParams]);

  return (
    <div className="">
      <div className="mx-auto max-w-7xl divide-y divide-gray-900/10 px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
        <h2 className="text-2xl font-bold leading-10 tracking-tight text-gray-900">
          Connecting...
        </h2>
      </div>
    </div>
  );
}
