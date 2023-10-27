import Image from "next/image";
import type { Metadata } from "next";
import APITabs from "./APITabs";
import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";

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
  let query: Prisma.MediaWhereInput = { username: account };

  const images = await prisma.media.findMany({
    where: query,
    orderBy: { timestamp: "desc" },
    take: 100,
  });

  return images;
}

export default async function Page({ params }: PageProps) {
  let images = await getData(params.account);

  return (
    <div className="">
      <div className="relative h-full ">
        <div className="relative pt-6 pb-16 ">
          <div className="mx-auto mt-16 max-w-[1000px] p-2 ">
            <div className="text-center">
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900  sm:text-5xl md:text-6xl">
                <span className="block text-blue-600">@{params.account}</span>
              </h1>
              <APITabs
                account={params.account}
                prefix="https://instagram-feed-api-gamma.vercel.app/api/v2"
              />

              <div className="grid md:grid-cols-3 justify-center mt-12 flex-col gap-8 rounded-lg">
                {images?.map((i) => (
                  <Image
                    key={i.id}
                    src={i.thumbnailUrl!}
                    alt={i.caption!}
                    width={400}
                    height={400}
                    className="w-full h-full object-cover"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
