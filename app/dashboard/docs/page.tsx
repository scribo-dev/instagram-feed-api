import { getApiDocs } from "@/lib/swagger";

import ReactSwagger from "../../api-doc/react-swagger";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default async function IndexPage() {
  const spec = await getApiDocs();
  return (
    <section className="container">
      <Suspense fallback={<span>"Loading..."</span>}>
        <ReactSwagger spec={spec} />
      </Suspense>
    </section>
  );
}
