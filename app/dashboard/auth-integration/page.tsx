import { Suspense } from "react";
import Redirect from "./Redirect";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account selector",
};

export default function Page() {
  return (
    <div className="">
      <div className="mx-auto container px-6 pt-6">
        <h2 className="text-3xl font-bold tracking-tight">Connecting...</h2>

        <Suspense fallback={null}>
          <Redirect />
        </Suspense>
      </div>
    </div>
  );
}
