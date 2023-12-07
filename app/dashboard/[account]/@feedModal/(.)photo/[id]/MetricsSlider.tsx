"use client";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import MediaMetrics from "../../../photo/[id]/MediaMetrics";
import { Media, Prisma } from "@prisma/client";
import { useRouter } from "next/navigation";
import { Metric } from "@/lib/fb-types";

export default function MetricsSlider({
  media,
  metrics,
}: {
  media: Prisma.MediaGetPayload<{
    include: { children: true };
  }>;
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
      <SheetContent className="md:max-w-[540px] overflow-auto p-0">
        <div className="relative h-full">
          <div className="relative pb-16 ">
            <MediaMetrics media={media} metrics={metrics} />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
