"use server";

import { getWorkflowClient } from "./temporal";
import { InstagramImage } from "./utils";

import { Redis } from "@upstash/redis";

if (!process.env.KV_URL || !process.env.KV_TOKEN) throw "env not found";

const kv = new Redis({
  url: process.env.KV_URL,
  token: process.env.KV_TOKEN,
});

function sortInstagramImages(images: InstagramImage[]) {
  return images.sort((a, b) => {
    if (a.takenAt > b.takenAt) return -1;
    if (a.takenAt < b.takenAt) return 1;
    return 0;
  });
}

export async function scrape(account: string) {
  // const res = fetch(`http://localhost:3000/api/${account}`);
  // return (await res).json();
  let cachedResults: InstagramImage[] = sortInstagramImages(
    await kv.lrange(account, 0, 12)
  );

  let responseRequest = await fetch(
    `https://api.scrape.do/?token=${process.env.SCRAPE_API}&url=https://www.instagram.com/api/v1/users/web_profile_info/?username=${account}`,
    { next: { revalidate: 60 * 5 } }
  );

  let response = await responseRequest.json();

  let images: InstagramImage[] = sortInstagramImages(
    response.data.user.edge_owner_to_timeline_media.edges.map(
      ({ node }: any) =>
        ({
          slug: node.shortcode,
          type: node.is_video ? "video" : "image",
          image: node.display_url,
          description: node.edge_media_to_caption?.edges[0]?.node?.text,
          takenAt: new Date(node.taken_at_timestamp * 1000).toISOString(),
          pinned: node.pinned_for_users && node.pinned_for_users.length > 0,
          video: node.is_video ? node.video_url : undefined,
        } as InstagramImage)
    )
  );

  let firstImage = images?.at(0);
  let firstStoredImage = cachedResults?.at(0);
  if (firstImage?.takenAt === firstStoredImage?.takenAt) {
    console.log(`${account} using cache`);
    return cachedResults;
  }

  try {
    const client = await getWorkflowClient();
    const result = await client.start("InstagramInterpreterV1", {
      args: [account],
      taskQueue: "instagram-interpreter",
      workflowId: `instagramV1-${account}`,
    });
  } catch (e) {
    console.error(e);
  }

  return cachedResults;
}
