import { scrape } from "@/lib/scrape";
import InstagramDialog from "../../@modal/(.)photo/[id]/InstagramDialog";
import Image from "next/image";

export default async function PhotoPage({
  params,
}: {
  params: { account: string; id: string };
}) {
  let images = await scrape(params.account);

  let selectedImage = images.find((i) => i.slug === params.id);

  if (!selectedImage) return null;

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="sm:max-w-[725px] p-0 overflow-hidden bg-white rounded border">
        <div className="grid grid-cols-2 gap-4 ">
          <Image
            src={selectedImage.image}
            alt={selectedImage.description}
            width={400}
            height={400}
            className="w-full h-full object-cover"
          />
          <div className="py-12 max-h-[calc(100vh-200px)] overflow-auto pr-4">
            {selectedImage.description}
          </div>
        </div>
      </div>
    </div>
  );
}
