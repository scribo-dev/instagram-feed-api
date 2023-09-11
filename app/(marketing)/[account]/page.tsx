import Image from "next/image";
import type { Metadata } from "next";
import { scrape } from "../../../lib/scrape";
import APITabs from "./APITabs";
import Link from "next/link";

// export const runtime = "edge";

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
  let res = await scrape(account);

  return res;
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
              <APITabs account={params.account} />

              <div className="grid md:grid-cols-3 justify-center mt-12 flex-col gap-8 rounded-lg">
                {images?.map((i) => (
                  <Link
                    key={i.slug}
                    href={`/${params.account}/photo/${i.slug}`}
                    className="w-[309px] h-[309px] overflow-hidden"
                  >
                    <Image
                      src={i.image}
                      alt={i.description}
                      width={400}
                      height={400}
                      className="w-full h-full object-cover"
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
