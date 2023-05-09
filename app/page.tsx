import Image from "next/image";
import Link from "next/link";
import { GenerateFeed } from "./_actions";
import Footer from "./Footer";

export default function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-gray-50 ">
      <div className="relative h-full ">
        <div className="relative pt-6 pb-16 ">
          <div className="mx-auto mt-16 max-w-3xl px-4 sm:mt-24 sm:px-6">
            <div className="text-center">
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900  sm:text-5xl md:text-6xl">
                Instagram <span className=" text-blue-600">Feed API</span>
              </h1>
              <p className="mx-auto mt-3 max-w-md text-base text-gray-500 sm:text-lg md:mt-5 md:max-w-3xl md:text-xl">
                Unleash the potential of Instagram feeds on your applications
                and projects with our powerful, easy-to-use API.
              </p>
              <div className="mt-12 flex flex-col gap-8 rounded-lg bg-gray-100 p-8 shadow">
                <form action={GenerateFeed} className="flex gap-2">
                  <input
                    name="account"
                    placeholder="@scribo-dev"
                    className="flex-1 flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background border px-2 bg-black text-white"
                  >
                    Test Now
                  </button>
                </form>
              </div>
            </div>
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
}
