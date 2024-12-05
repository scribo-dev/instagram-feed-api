import { getMediaMetrics } from "../../../photo/[id]/actions";
import MetricsSlider from "./MetricsSlider";

export default async function Page(
  props: {
    params: Promise<{ account: string; id: string }>;
  }
) {
  const params = await props.params;
  const { media, metrics } = await getMediaMetrics(params.account, params.id);

  if (!media) return null;

  return <MetricsSlider media={media} metrics={metrics} />;
}
