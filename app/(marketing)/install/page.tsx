import { Metadata } from "next";
import { prisma } from "@/lib/db";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Button } from "@/components/ui/button";
import { CheckIcon, PlusCircleIcon } from "lucide-react";
import FacebookLogin from "@/app/dashboard/FacebookLogin";

// export const runtime = "edge";
export const dynamic = "force-dynamic";

export default async function Page({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <div className="">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
        <h2 className="text-2xl font-bold leading-10 tracking-tight text-gray-900">
          Install Steps
        </h2>
        <div className="pt-4 flex flex-col divide-y divide">
          <div className="flex py-8">
            <span className="flex-1 text-xl font-medium">
              1. Convert your account to a Professional account
            </span>
            <Button asChild>
              <a
                href="https://help.instagram.com/502981923235522/?helpref=uf_share"
                target="_blank"
              >
                Tutorial
              </a>
            </Button>
          </div>

          <div className="flex py-8">
            <span className="flex-1 text-xl font-medium">
              2. Connect a Facebook Page to your Instagram professional account
            </span>
            <Button asChild>
              <a
                href="https://help.instagram.com/570895513091465/?helpref=uf_share"
                target="_blank"
              >
                Tutorial
              </a>
            </Button>
          </div>

          <div className="flex py-8">
            <span className="flex-1 text-xl font-medium">
              3. Give access to our App
            </span>
            <FacebookLogin />
          </div>
        </div>
      </div>
    </div>
  );
}
