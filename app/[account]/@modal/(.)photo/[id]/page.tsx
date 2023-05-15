import InstagramDialog from "./InstagramDialog";
import { scrape } from "@/app/api/[account]/scrape";

export default async function PhotoPage({
  params,
}: {
  params: { account: string; id: string };
}) {
  let images = await scrape(params.account);

  let selectedImage = images.find((i) => i.slug === params.id);

  return <InstagramDialog selectedImage={selectedImage} />;
}
