"use server";

import kv from "@vercel/kv";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
  region: "us-east-1",
});

type InstagramImage = {
  slug: string;
  image: string;
  description: string;
  takenAt: string;
  pinned: boolean;
};

function sortInstagramImages(images: InstagramImage[]) {
  return images.sort((a, b) => {
    if (a.takenAt > b.takenAt) return -1;
    if (a.takenAt < b.takenAt) return 1;
    return 0;
  });
}

async function uploadFile(
  account: string,
  image: InstagramImage,
  finalImageList: InstagramImage[]
) {
  try {
    let filename = `${account}/${image.slug}.jpeg`;

    let imageRequest = await fetch(image.image);

    let buffer = await imageRequest.arrayBuffer();

    await s3Client.send(
      new PutObjectCommand({
        Bucket: "instagram-feed-api",
        Key: filename,
        Body: Buffer.from(buffer),
        CacheControl: "max-age=31536000",
      })
    );

    filename = `${process.env.CDN_URL}/${filename}`;

    finalImageList.push({ ...image, image: filename });
    kv.lpush(account, { ...image, image: filename });
  } catch (e) {
    console.error(e);
  }
}

export async function scrape(account: string) {
  let cachedResults: InstagramImage[] = sortInstagramImages(
    await kv.lrange(account, 0, 12)
  );

  let responseRequest = await fetch(
    `https://api.scrape.do/?token=${process.env.SCRAPE_API}&url=https://www.instagram.com/${account}/?__a=1%26__d=dis`,
    { next: { revalidate: 60 * 5 } }
  );

  let response = await responseRequest.json();
  let images: InstagramImage[] = sortInstagramImages(
    response.graphql.user.edge_owner_to_timeline_media.edges.map(
      ({ node }: any) =>
        ({
          slug: node.shortcode,
          image: node.display_url,
          description: node.edge_media_to_caption?.edges[0]?.node?.text,
          takenAt: new Date(node.taken_at_timestamp * 1000).toISOString(),
          pinned: node.pinned_for_users && node.pinned_for_users.length > 0,
        } as InstagramImage)
    )
  );

  let firstImage = images?.at(0);
  let firstStoredImage = cachedResults?.at(0);
  if (firstImage?.takenAt === firstStoredImage?.takenAt) {
    console.log(`${account} using cache`);
    return cachedResults;
  }

  await kv.del(account);

  let finalImageList: InstagramImage[] = [];
  await Promise.allSettled(
    images.map((i) => uploadFile(account, i, finalImageList))
  );

  // kv.expire(account, 1);

  return sortInstagramImages(finalImageList);
}
