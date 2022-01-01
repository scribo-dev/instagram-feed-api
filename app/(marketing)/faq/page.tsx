import { Metadata } from "next";

export const runtime = "edge";

export const metadata: Metadata = {
  title: "FAQ | Instagram Feed API",
  description: "Common questions about Instagram Feed API",
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
    answer: "On the free plan you are limited to 1,000 requests per month",
  },
  {
    id: 3,
    question: "What happens if I need more?",
    answer:
      "If you exceed the 1,000 requests limit, we will contact you to upgrade your plan",
  },
];

export default async function Page() {
  return (
    <div className="">
      <div className="mx-auto max-w-7xl divide-y divide-gray-900/10 px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
        <h2 className="text-2xl font-bold leading-10 tracking-tight text-gray-900">
          Frequently asked questions
        </h2>
        <dl className="mt-10 space-y-8 divide-y divide-gray-900/10">
          {faqs.map((faq) => (
            <div key={faq.id} className="pt-8 lg:grid lg:grid-cols-12 lg:gap-8">
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
  );
}
