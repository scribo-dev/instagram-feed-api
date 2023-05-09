import Image from "next/image";
import { scrape } from "../api/[account]/scrape";

export const runtime = "edge";

async function getData(account: string) {
  let res = await scrape(account);

  return res;
}

export default async function Page({
  params,
}: {
  params: { account: string };
}) {
  let images = await getData(params.account);

  return (
    <div className="bg-gray-50 ">
      <div className="relative h-full ">
        <div className="relative pt-6 pb-16 ">
          <div className="mx-auto mt-16 max-w-[935px]  sm:mt-24">
            <div className="text-center">
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900  sm:text-5xl md:text-6xl">
                <span className="block text-blue-600">@{params.account}</span>
              </h1>
              <p className="mx-auto mt-3 text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl">
                Nail your topic-based questions with Git Readme! Here you can
                have tailor-made answers based on your GitHub repository's
                content.
              </p>
              <div className="grid grid-cols-3 mt-12 flex-col gap-8 rounded-lg bg-gray-100 ">
                {images?.map((i) => (
                  <div
                    key={i.slug}
                    className="w-[309px] h-[309px] overflow-hidden"
                  >
                    <Image
                      src={`https://d2b8b46ja6xujp.cloudfront.net/${i.image}`}
                      alt={i.description}
                      width={400}
                      height={400}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
            {/* <Footer /> */}
          </div>
        </div>
      </div>
    </div>
  );
}
