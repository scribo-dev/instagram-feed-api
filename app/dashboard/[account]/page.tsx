import Image from "next/image";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { Media } from "@prisma/client";
import { getServerSession } from "next-auth";

import Link from "next/link";
import { authOptions } from "@/lib/auth-options";
import { LineChart, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

type PageProps = {
  params: { account: string };
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  return {
    title: `@${params.account} Instagram Feed API`,
    description: `Feed API from @${params.account}`,
  };
}

async function getData(account: string) {
  const session = await getServerSession(authOptions);

  const tokens = await prisma?.apiToken.findMany({
    where: { userId: session?.user?.id },
    include: {
      accounts: true,
    },
  });
  const selectedToken = tokens && tokens[0];
  const images = (
    await (
      await fetch(
        `${process.env.APP_URL}/api/v2/${account}?media-product-type=FEED`,
        {
          headers: { Authorization: `Bearer ${selectedToken.id}` },
        }
      )
    ).json()
  ).data as Media[];

  const stories = (
    await (
      await fetch(
        `${process.env.APP_URL}/api/v2/${account}?media-product-type=STORY`,
        {
          headers: { Authorization: `Bearer ${selectedToken.id}` },
        }
      )
    ).json()
  ).data as Media[];
  return { images, stories };
}

export default async function Page({ params }: PageProps) {
  let { images, stories } = await getData(params.account);

  return (
    <div className="">
      <div className="relative h-full ">
        <div className="relative pt-6 pb-16 ">
          <div className="mx-auto max-w-[1000px] p-2 ">
            <div className="">
              <div className="flex items-center">
                <h1 className="flex-1 text-3xl tracking-tight text-gray-900">
                  Account {params.account}
                </h1>
                <div>
                  <Button asChild>
                    <Link href={`/dashboard/${params.account}/metrics`}>
                      <LineChart />
                      Metrics
                    </Link>
                  </Button>
                </div>
              </div>
              {!images || images.length === 0 ? (
                <div className="flex flex-col w-full items-center mt-32">
                  <RefreshCcw size={64} />
                  <span className="mt-8 text-lg">Syncing...</span>
                  <span className="text-sm text-zinc-600">
                    Please retry in a couple of minutes
                  </span>
                  <Button asChild>
                    <Link
                      className="mt-4"
                      href={`/dashboard/${params.account}`}
                    >
                      Refresh
                    </Link>
                  </Button>
                </div>
              ) : null}
              <div className="grid md:grid-cols-3 justify-center mt-6 flex-col gap-2 rounded-lg">
                {stories?.map((i) => (
                  <Link
                    key={i.id}
                    href={`/dashboard/${params.account}/photo/${i.id}`}
                    className="w-[100px] h-[100px] rounded-full overflow-hidden"
                  >
                    <Image
                      src={i.thumbnailUrl!}
                      alt={i.caption ?? "Media Caption"}
                      width={100}
                      height={100}
                      className=" h-[100px] object-cover"
                    />
                  </Link>
                ))}
              </div>
              <div className="grid md:grid-cols-3 justify-center mt-6 flex-col gap-2 rounded-lg">
                {images?.map((i) => (
                  <Link
                    key={i.id}
                    href={`/dashboard/${params.account}/photo/${i.id}`}
                    className="h-[309px] overflow-hidden"
                  >
                    <Image
                      src={i.thumbnailUrl!}
                      alt={i.caption ?? "Media Caption"}
                      width={400}
                      height={400}
                      className=" h-[309px] object-cover"
                    />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
