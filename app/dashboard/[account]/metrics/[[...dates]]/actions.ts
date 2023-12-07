import { prisma } from "@/lib/db";
import { MetricValues, MetricsResponse } from "@/lib/fb-types";
import { parseISO } from "date-fns";

export type InstagramProfile = {
  id: string;
  profile_picture_url: string;
};

export async function getMetrics(account: string, dates?: string[]) {
  const instagramAccount = await prisma?.instagramAccount?.findFirst({
    where: {
      username: account,
    },
  });

  if (!instagramAccount) return { error: "Instagram account not synched" };

  const profileRequest = await fetch(
    `https://graph.facebook.com/v18.0/${instagramAccount.id}?fields=profile_picture_url&access_token=${instagramAccount?.accessToken}`
  );

  const profile = (await profileRequest.json()) as InstagramProfile;
  const categories = [
    {
      title: "Profile Views",
      name: "profile_views",
      color: "teal",
    },
    {
      title: "Impressions",
      name: "impressions",
      color: "indigo",
    },
    {
      title: "Reach",
      name: "reach",
      color: "cyan",
    },
  ];
  let url = `https://graph.facebook.com/v18.0/${instagramAccount.id}/insights?metric=impressions,reach,profile_views&period=day&access_token=${instagramAccount?.accessToken}`;
  if (dates && dates.length > 1) {
    const since = getTimestampInSeconds(parseISO(dates[0]));
    const until = getTimestampInSeconds(parseISO(dates[1]));
    url += `&since=${since}&until=${until}`;
  }
  const metricsRequest = await fetch(url);

  const metricsResponse = (await metricsRequest.json()) as MetricsResponse;
  const metrics = categories.map((c) => {
    const categoryMetrics = metricsResponse.data
      .find((d) => d.name === c.name)
      ?.values.map((v) => {
        const value = v as MetricValues;
        return {
          date: value.end_time,
          metric: value.value,
          [c.name]: value.value,
        };
      });
    return {
      ...c,
      metrics: categoryMetrics,
    };
  });

  return { profile, metrics, error: null };
}

function getTimestampInSeconds(date: Date) {
  return Math.floor(date.getTime() / 1000);
}
