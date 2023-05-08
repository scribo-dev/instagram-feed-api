import Image from "next/image";
import Link from "next/link";
import { GenerateFeed } from "./_actions";

export default function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-gray-50 ">
      <div className="relative h-full ">
        <div className="absolute inset-y-0 h-full w-full" aria-hidden="true">
          <div className="relative h-full">
            <svg
              className="absolute right-full bottom-0 translate-y-1/2 translate-x-1/4 transform sm:translate-x-1/2  lg:translate-x-full"
              width={404}
              height={784}
              fill="none"
              viewBox="0 0 404 784"
            >
              <defs>
                <pattern
                  id="e229dbec-10e9-49ee-8ec3-0286ca089edf"
                  x={0}
                  y={0}
                  width={20}
                  height={20}
                  patternUnits="userSpaceOnUse"
                >
                  <rect
                    x={0}
                    y={0}
                    width={4}
                    height={4}
                    className="text-gray-200 "
                    fill="currentColor"
                  />
                </pattern>
              </defs>
              <rect
                width={404}
                height={784}
                fill="url(#e229dbec-10e9-49ee-8ec3-0286ca089edf)"
              />
            </svg>
            <svg
              className="absolute left-full -translate-y-3/4 -translate-x-1/4 transform sm:-translate-x-1/2 md:-translate-y-1/2 lg:-translate-x-3/4"
              width={404}
              height={784}
              fill="none"
              viewBox="0 0 404 784"
            >
              <defs>
                <pattern
                  id="d2a68204-c383-44b1-b99f-42ccff4e5365"
                  x={0}
                  y={0}
                  width={20}
                  height={20}
                  patternUnits="userSpaceOnUse"
                >
                  <rect
                    x={0}
                    y={0}
                    width={4}
                    height={4}
                    className="text-gray-200 "
                    fill="currentColor"
                  />
                </pattern>
              </defs>
              <rect
                width={404}
                height={784}
                fill="url(#d2a68204-c383-44b1-b99f-42ccff4e5365)"
              />
            </svg>
          </div>
        </div>

        <div className="relative pt-6 pb-16 ">
          <div className="mx-auto mt-16 max-w-3xl px-4 sm:mt-24 sm:px-6">
            <div className="text-center">
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900  sm:text-5xl md:text-6xl">
                <span className="block">Instagram</span>
                <span className="block text-blue-600">Feed API</span>
              </h1>
              <p className="mx-auto mt-3 max-w-md text-base text-gray-500 sm:text-lg md:mt-5 md:max-w-3xl md:text-xl">
                Nail your topic-based questions with Git Readme! Here you can
                have tailor-made answers based on your GitHub repository's
                content.
              </p>
              <div className="mt-12 flex flex-col gap-8 rounded-lg bg-gray-100 p-8 shadow">
                <form action={GenerateFeed}>
                  <button type="submit">Add to Cart</button>
                </form>
                {/* <form className="flex gap-4" onSubmit={handleSubmit(onSubmit)}>
                  <Input
                    type="text"
                    {...register("url")}
                    placeholder="https://github.com/scribo-dev/public-docs"
                  />
                  <Button type="submit">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving
                      </>
                    ) : (
                      "Start"
                    )}
                  </Button>
                </form> */}
              </div>
            </div>
            {/* <Footer /> */}
          </div>
        </div>
      </div>
    </div>
  );
}
