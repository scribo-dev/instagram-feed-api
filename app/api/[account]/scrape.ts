"use server";

// import kv from "@vercel/kv";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
  region: "us-east-1",
});

const FIVE_MINUTES = 60 * 5;

type InstagramImage = {
  slug: string;
  image: string;
  description: string;
  takenAt: Date;
  pinned: boolean;
};

export async function scrape(account: string) {
  // let cachedResults = await kv.lrange(account, 0, 12);

  // if (cachedResults && cachedResults.length > 0) return cachedResults;

  let responseRequest = await fetch(
    `https://api.scrape.do/?token=${process.env.SCRAPE_API}&url=https://www.instagram.com/${account}/?__a=1%26__d=dis`,
    { next: { revalidate: 60 * 5 } }
  );

  let response = await responseRequest.json();
  let images: InstagramImage[] =
    response.graphql.user.edge_owner_to_timeline_media.edges.map(
      ({ node }: any) =>
        ({
          slug: node.shortcode,
          image: node.display_url,
          description: node.edge_media_to_caption?.edges[0]?.node?.text,
          takenAt: new Date(node.taken_at_timestamp * 1000),
          pinned: node.pinned_for_users && node.pinned_for_users.length > 0,
        } as InstagramImage)
    );

  for (let image of images) {
    try {
      const filename = `${account}/${image.slug}.jpeg`;

      let imageRequest = await fetch(image.image);

      let buffer = await imageRequest.arrayBuffer();
      console.log(filename);
      let uploadRequest = await s3Client.send(
        new PutObjectCommand({
          Bucket: "instagram-feed-api",
          Key: filename,
          Body: Buffer.from(buffer),
        })
      );

      // kv.lpush(account, { ...image, image: filename });
    } catch (e) {
      console.error(e);
    }
  }
  // kv.expire(account, FIVE_MINUTES);

  return images;
}
