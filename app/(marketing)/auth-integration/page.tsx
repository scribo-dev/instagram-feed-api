import { Suspense } from "react";
import Redirect from "./Redirect";

export default function Page() {
  return (
    <div className="">
      <div className="mx-auto max-w-7xl divide-y divide-gray-900/10 px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
        <h2 className="text-2xl font-bold leading-10 tracking-tight text-gray-900">
          Connecting...
        </h2>

        <Suspense fallback={null}>
          <Redirect />
        </Suspense>
      </div>
    </div>
  );
}
