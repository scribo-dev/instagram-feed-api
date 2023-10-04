import { getApiDocs } from "@/lib/swagger";

import ReactSwagger from "../../api-doc/react-swagger";

export const dynamic = "force-dynamic";

export default async function IndexPage() {
  const spec = await getApiDocs();
  console.log(JSON.stringify(spec));
  return (
    <section className="container">
      <ReactSwagger spec={spec} />
    </section>
  );
}
