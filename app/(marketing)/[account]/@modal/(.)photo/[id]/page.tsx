import { Suspense } from "react";
import InstagramDialog from "./InstagramDialog";
import { scrape } from "@/lib/scrape";

export default async function PhotoPage(
  props: {
    params: Promise<{ account: string; id: string }>;
  }
) {
  const params = await props.params;
  let images = await scrape(params.account);

  let selectedImage = images.find((i) => i.slug === params.id);

  return (
    <Suspense fallback={"Loading..."}>
      <InstagramDialog selectedImage={selectedImage} />
    </Suspense>
  );
}
