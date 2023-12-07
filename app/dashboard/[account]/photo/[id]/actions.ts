import { prisma } from "@/lib/db";
import { Metric, MetricsResponse } from "@/lib/fb-types";
import { MediaProductType } from "@prisma/client";

export async function getMediaMetrics(account: string, id: string) {
  const instagramAccount = await prisma?.instagramAccount?.findFirst({
    where: {
      username: account,
    },
  });

  const media = await prisma?.media?.findFirst({
    where: {
      id: id,
    },
    include: {
      children: { orderBy: { timestamp: "desc" } },
    },
  });

  let metrics: Metric[] = [];
  try {
    let fetchMetrics = "total_interactions,impressions,reach,saved,video_views";
    if (media?.mediaProductType === "REELS")
      fetchMetrics =
        "plays,reach,total_interactions,likes,shares,comments,saved";
    else if (media?.mediaProductType === "STORY")
      fetchMetrics = "impressions,reach,replies";

    const metricsRequest = await fetch(
      `https://graph.facebook.com/v18.0/${id}/insights?fields=name,values,period,description,title&metric=${fetchMetrics}&access_token=${instagramAccount?.accessToken}`
    );

    const metricsResponse = (await metricsRequest.json()) as MetricsResponse;
    metrics = metricsResponse.data;
  } catch (e) {}

  return { media, metrics };
}
