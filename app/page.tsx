import Image from "next/image";
import Link from "next/link";
import { GenerateFeed } from "./_actions";
import Footer from "./Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Instagram Feed API",
  description: "Generate an API for your Instagram Feed in seconds",
};

const faqs = [
  {
    question: "What's the best thing about Switzerland?",
    answer:
      "I don't know, but the flag is a big plus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat.",
  },
  // More questions...
];

export default function Home() {
  return (
    <div>
      <main>
        <div className="overflow-hidden">
          <div className="mx-auto max-w-7xl px-6 pb-32 pt-36 sm:pt-60 lg:px-8 lg:pt-32">
            <div className="mx-auto max-w-2xl gap-x-14 lg:mx-0 lg:flex lg:max-w-none lg:items-center">
              <div className="w-full max-w-xl lg:shrink-0 xl:max-w-2xl">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                  Free Instagram Feed API
                </h1>
                <p className="relative mt-6 text-lg leading-8 text-gray-600 sm:max-w-md lg:max-w-none">
                  Imagine a world where you can seamlessly integrate Instagram
                  feeds into your applications and projects, enhancing user
                  experience and engagement like never before. InstaConnect API
                  is here to turn that vision into reality!
                </p>
                <div className="">
                  <form
                    action={GenerateFeed}
                    className="mt-8 flex items-center gap-2 max-w-[360px] lg:max-w-[500px]"
                  >
                    <input
                      name="account"
                      placeholder="Enter your account @..."
                      className="flex-1 bg-white flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                    <button
                      type="submit"
                      className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Test Now
                    </button>
                  </form>
                </div>
              </div>
              <div className="mt-14 flex justify-end gap-8 sm:-mt-44 sm:justify-start sm:pl-20 lg:mt-0 lg:pl-0">
                <div className="ml-auto w-44 flex-none space-y-8 pt-32 sm:ml-0 sm:pt-80 lg:order-last lg:pt-36 xl:order-none xl:pt-80">
                  <div className="relative">
                    <img
                      src="https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&h=528&q=80"
                      alt=""
                      className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                    />
                    <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                  </div>
                </div>
                <div className="mr-auto w-44 flex-none space-y-8 sm:mr-0 sm:pt-52 lg:pt-36">
                  <div className="relative">
                    <img
                      src="https://images.unsplash.com/photo-1485217988980-11786ced9454?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&h=528&q=80"
                      alt=""
                      className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                    />
                    <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                  </div>
                  <div className="relative">
                    <img
                      src="https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&crop=focalpoint&fp-x=.4&w=396&h=528&q=80"
                      alt=""
                      className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                    />
                    <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                  </div>
                </div>
                <div className="w-44 flex-none space-y-8 pt-32 sm:pt-0">
                  <div className="relative">
                    <img
                      src="https://images.unsplash.com/photo-1670272504528-790c24957dda?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&crop=left&w=400&h=528&q=80"
                      alt=""
                      className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                    />
                    <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                  </div>
                  <div className="relative">
                    <img
                      src="https://images.unsplash.com/photo-1670272505284-8faba1c31f7d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&h=528&q=80"
                      alt=""
                      className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                    />
                    <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );

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

            <div className="">
              <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                  <h2 className="text-2xl font-bold leading-10 tracking-tight text-gray-900">
                    Frequently asked questions
                  </h2>
                  <p className="mt-6 text-base leading-7 text-gray-600">
                    Have a different question and can’t find the answer you’re
                    looking for? Reach out to our support team by{" "}
                    <a
                      href="#"
                      className="font-semibold text-indigo-600 hover:text-indigo-500"
                    >
                      sending us an email
                    </a>{" "}
                    and we’ll get back to you as soon as we can.
                  </p>
                </div>
                <div className="mt-20">
                  <dl className="space-y-16 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-16 sm:space-y-0 lg:grid-cols-3 lg:gap-x-10">
                    {faqs.map((faq) => (
                      <div key={faq.id}>
                        <dt className="text-base font-semibold leading-7 text-gray-900">
                          {faq.question}
                        </dt>
                        <dd className="mt-2 text-base leading-7 text-gray-600">
                          {faq.answer}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </div>

            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
}
