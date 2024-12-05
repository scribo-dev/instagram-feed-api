import MediaMetrics from "./MediaMetrics";
import { getMediaMetrics } from "./actions";

export default async function Page(
  props: {
    params: Promise<{ account: string; id: string }>;
  }
) {
  const params = await props.params;
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
