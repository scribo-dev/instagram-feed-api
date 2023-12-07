import { prisma } from "@/lib/db";
import { Metric, MetricsResponse } from "@/lib/fb-types";

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
    include: {
      children: { orderBy: { timestamp: "desc" } },
    },
  });

  return { media, metrics };
}
