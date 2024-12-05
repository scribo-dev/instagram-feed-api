import { GenerateFeed } from "../_actions";
import type { Metadata } from "next";
import { CodeExamples } from "./components/CodeExamples";

export const metadata: Metadata = {
  title: "Instagram Feed API",
  description: "Generate an API for your Instagram Feed in seconds",
};

const faqs = [
  {
    id: 1,
    question: "Do I need a credit card to start using?",
    answer: "No, our service is free until you reach our limits",
  },
  {
    id: 2,
    question: "Whats the limitation of the free plan?",
    answer: "On the free plan you are limited to 5 requests per 10 seconds",
  },
  {
    id: 3,
    question: "What happens if I need more?",
    answer: "Please contact us to upgrade your plan at contact@scribo.dev",
  },
];

export default function Home() {
  return (
    <div>
      <main>
        <div className="mx-auto max-w-7xl px-4">
          <div className="gap-x-14 flex flex-col lg:flex-row items-center pt-64">
            <div className="w-full flex-1">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                Free Instagram Feed API
              </h1>
              <p className="relative mt-6 text-lg leading-8 text-gray-600 sm:max-w-md lg:max-w-none">
                Imagine a world where you can seamlessly integrate Instagram
                feeds into your applications and projects, enhancing user
                experience and engagement like never before. InstaConnect API is
                here to turn that vision into reality!
              </p>
              <div className="">
                <form
                  action={GenerateFeed}
                  className="mt-8 flex items-center gap-2 max-w-[360px] lg:max-w-[500px]"
                >
                  <input
                    name="account"
                    placeholder="Enter your public account @..."
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
            <div className="flex-1 mt-14 flex justify-end gap-8">
              <CodeExamples />
            </div>
          </div>

          <div className="py-64 divide-y divide-gray-900/10 ">
            <h2 className="text-2xl font-bold leading-10 tracking-tight text-gray-900">
              Frequently asked questions
            </h2>
            <dl className="mt-10 space-y-8 divide-y divide-gray-900/10">
              {faqs.map((faq) => (
                <div
                  key={faq.id}
                  className="pt-8 lg:grid lg:grid-cols-12 lg:gap-8"
                >
                  <dt className="text-base font-semibold leading-7 text-gray-900 lg:col-span-5">
                    {faq.question}
                  </dt>
                  <dd className="mt-4 lg:col-span-7 lg:mt-0">
                    <p className="text-base leading-7 text-gray-600">
                      {faq.answer}
                    </p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </main>
    </div>
  );
}
