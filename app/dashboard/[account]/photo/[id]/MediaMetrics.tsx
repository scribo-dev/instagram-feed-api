"use client";

import { Metric } from "@/lib/fb-types";
import { Prisma, Media } from "@prisma/client";
import { Badge, BarList, Card } from "@tremor/react";
import Image from "next/image";
import { intlFormat } from "date-fns";

function MediaBox({ media, className }: { media?: Media; className: string }) {
  return media?.mediaType === "VIDEO" && media.mediaUrl.includes(".mp4") ? (
    <video
      src={media.mediaUrl}
      controls={true}
      autoPlay={false}
      width={400}
      height={400}
      className={className.replace("object-cover", "")}
    />
  ) : (
    <Image
      src={media?.mediaUrl!}
      alt={media?.caption ?? "Media Caption"}
      width={540}
      height={540}
      className={className}
    />
  );
}

export default function MediaMetrics({
  media,
  metrics = [],
}: {
  media?: Prisma.MediaGetPayload<{
    include: { children: true };
  }>;
  metrics?: Metric[];
}) {
  const barData = metrics.map((m) => ({
    name: m.title,
    value: m.values[0].value,
  }));
  return (
    <div>
      {media?.children && media?.children?.length > 0 ? (
        <div className="relative w-full flex gap-2 snap-x snap-mandatory overflow-x-auto">
          {media?.children?.map((m) => (
            <div className="snap-center shrink-0" key={m.id}>
              <MediaBox media={m} className="w-full h-[540px] object-cover" />
            </div>
          ))}
        </div>
      ) : (
        <MediaBox media={media} className="w-full h-[540px] object-cover" />
      )}
      {barData && barData.length > 0 && (
        <div className="p-8 ">
          <div className="flex items-center justify-between">
            <Badge>{media?.mediaProductType}</Badge>
            <span className="text-zinc-600 text-sm">
              {media?.timestamp ? intlFormat(media.timestamp) : null}
            </span>
          </div>
          <p className="mt-4 text-zinc-600 text-sm">{media?.caption}</p>
          <Card className="flex flex-col mt-8 gap-2 text-zinc-600 text-sm">
            <BarList
              data={barData}
              showAnimation={false}

              // valueFormatter={valueFormatter}
            />
          </Card>
        </div>
      )}
    </div>
  );
}
