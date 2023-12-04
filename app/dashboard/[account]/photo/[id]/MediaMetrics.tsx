"use client";

import { Media } from "@prisma/client";
import Image from "next/image";

export interface MetricsResponse {
  data: Metric[];
}

export interface Metric {
  name: string;
  values: MetricValue[];
  period: string;
  description: string;
  title: string;
  id: string;
}

export interface MetricValue {
  value: number;
}

export default function MediaMetrics({
  media,
  metrics = [],
}: {
  media?: Media;
  metrics?: Metric[];
}) {
  return (
    <div>
      {media?.mediaType === "VIDEO" ? (
        <video src={media.mediaUrl} controls={true} autoPlay={true} />
      ) : (
        <Image
          src={media?.mediaUrl!}
          alt={media?.caption ?? "Media Caption"}
          width={400}
          height={400}
          className="w-[309px] h-[309px] object-cover"
        />
      )}
      <div className="flex flex-col mt-8 gap-2">
        {metrics?.map((metric) => (
          <div key={metric.id} className="flex justify-between">
            <p className="text-zinc-500">{metric.title}: </p>
            <span className="text-black">{metric.values[0].value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
