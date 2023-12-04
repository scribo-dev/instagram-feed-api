import { prisma } from "@/lib/db";
import MediaMetrics from "./MediaMetrics";

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

export async function getMediaMetrics(account: string, id: string) {
  const instagramAccount = await prisma?.instagramAccount?.findFirst({
    where: {
      username: account,
    },
  });

  let metrics: Metric[] = [];
  try {
    const metricsRequest = await fetch(
      `https://graph.facebook.com/v18.0/${id}/insights?fields=name,values,period,description,title&metric=%20total_interactions,impressions,reach,saved,video_views&access_token=${instagramAccount?.accessToken}`
    );

    const metricsResponse = (await metricsRequest.json()) as MetricsResponse;
    metrics = metricsResponse.data;
  } catch (e) {}

  const media = await prisma?.media?.findFirst({
    where: {
      id: id,
    },
  });

  return { media, metrics };
}

export default async function Page({
  params,
}: {
  params: { account: string; id: string };
}) {
  const { media, metrics } = await getMediaMetrics(params.account, params.id);

  if (!media) return null;

  return (
    <div className="relative h-full ">
      <div className="relative pt-6 pb-16 ">
        <div className="mx-auto max-w-[309px] p-2 ">
          <MediaMetrics media={media} metrics={metrics} />
        </div>
      </div>
    </div>
  );
}
