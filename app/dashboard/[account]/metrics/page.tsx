import Image from "next/image";
import { getMetrics } from "./actions";

export default async function Page({
  params,
}: {
  params: { account: string };
}) {
  const { profile, error } = await getMetrics(params.account);

  return (
    <div className="relative h-full ">
      <div className="relative pt-6 pb-16 ">
        {profile && (
          <div className="mx-auto max-w-[309px] p-2 flex flex-col items-center">
            <div className="w-[200px] h-[200px] rounded-full overflow-hidden">
              <Image
                src={profile?.profile_picture_url}
                alt={"Account profile picture"}
                width={400}
                height={400}
                className=" h-[309px] object-cover"
              />
            </div>
            <h1 className="mt-4 text-center text-lg">{params.account}</h1>
          </div>
        )}
      </div>
    </div>
  );
}
