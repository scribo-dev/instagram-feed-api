import { getMediaMetrics } from "../../../photo/[id]/page";
import MetricsSlider from "./MetricsSlider";

export default async function Page({
  params,
}: {
  params: { account: string; id: string };
}) {
  const { media, metrics } = await getMediaMetrics(params.account, params.id);

  if (!media) return null;

  return <MetricsSlider media={media} metrics={metrics} />;
}
