"use client";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import MediaMetrics, { Metric } from "../../../photo/[id]/MediaMetrics";
import { Media } from "@prisma/client";
import { useRouter } from "next/navigation";

export default function MetricsSlider({
  media,
  metrics,
}: {
  media: Media;
  metrics: Metric[];
}) {
  const router = useRouter();

  return (
    <Sheet
      open={true}
      modal={true}
      onOpenChange={(open) => {
        if (!open) router.back();
      }}
      key="feed-modal"
    >
      <SheetContent className="w-[400px] sm:w-[540px]">
        <div className="relative h-full">
          <div className="relative pt-6 pb-16 ">
            <div className="mx-auto max-w-[309px] p-2 ">
              <MediaMetrics media={media} metrics={metrics} />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
