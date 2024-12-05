import Image from "next/image";
import type { Metadata } from "next";
import { scrape } from "../../../lib/scrape";
import APITabs from "./APITabs";
import Link from "next/link";

type PageProps = {
  params: Promise<{ account: string }>;
};

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  return {
    title: `@${params.account} Instagram Feed API`,
    description: `Feed API from @${params.account}`,
  };
}

async function getData(account: string) {
  let res = await scrape(account);

  return res;
}

export default async function Page(props: PageProps) {
  const params = await props.params;
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

              {images?.length === 0 && (
                <div className="flex flex-col items-center text-center text-gray-500 gap-4 pt-32">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="64"
                    height="64"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    className="lucide lucide-cpu"
                  >
                    <rect width="16" height="16" x="4" y="4" rx="2" />
                    <rect width="6" height="6" x="9" y="9" rx="1" />
                    <path d="M15 2v2" />
                    <path d="M15 20v2" />
                    <path d="M2 15h2" />
                    <path d="M2 9h2" />
                    <path d="M20 15h2" />
                    <path d="M20 9h2" />
                    <path d="M9 2v2" />
                    <path d="M9 20v2" />
                  </svg>
                  We might still be processing the account. <br /> Try again in
                  a minute.
                </div>
              )}
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
