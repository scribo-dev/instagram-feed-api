"use client";

import { Metric } from "@/lib/fb-types";
import { Prisma, Media } from "@prisma/client";
import Image from "next/image";

function MediaBox({ media, className }: { media?: Media; className: string }) {
  return media?.mediaType === "VIDEO" ? (
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
      <div className="p-4 ">
        <p className="mt-4 text-zinc-600 text-sm">{media?.caption}</p>
        <div className="flex flex-col mt-8 gap-2 text-zinc-600 text-sm">
          {metrics?.map((metric) => (
            <div key={metric.id} className="flex justify-between">
              <p className="text-zinc-500">{metric.title}: </p>
              <span className="text-black">{metric.values[0].value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
