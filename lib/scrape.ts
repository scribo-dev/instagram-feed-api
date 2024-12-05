"use server";

import { unstable_after } from "next/server";
import { InstagramImage } from "./utils";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

import { Redis } from "@upstash/redis";

if (!process.env.KV_URL || !process.env.KV_TOKEN) throw "env not found";

const kv = new Redis({
  url: process.env.KV_URL,
  token: process.env.KV_TOKEN,
});

const s3Client = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
  region: "us-east-1",
});

function sortInstagramImages(images: InstagramImage[]) {
  return images.sort((a, b) => {
    if (a.takenAt > b.takenAt) return -1;
    if (a.takenAt < b.takenAt) return 1;
    return 0;
  });
}

export async function scrape(account: string) {
  // Get cached results (these are always stored)
  const cachedResults: InstagramImage[] = sortInstagramImages(
    await kv.lrange(account, 0, 12)
  );

  // Process and upload new images
  unstable_after(async () => {
    const expirationKey = `${account}:last_update`;
    const isExpired = !(await kv.exists(expirationKey));

    if (!isExpired) {
      console.log(`${account} using cache`);
      return;
    }

    console.log(`Scraping ${account}...`);
    let responseRequest = await fetch(
      `https://api.scrape.do/?token=${process.env.SCRAPE_API}&url=https://www.instagram.com/api/v1/users/web_profile_info/?username=${account}`
    );

    if (!responseRequest.ok) {
      if (cachedResults.length > 0) {
        return cachedResults;
      }
      return new Response("Error", { status: 500 });
    }

    let response = await responseRequest.json();
    let images: InstagramImage[] = sortInstagramImages(
      response.data.user.edge_owner_to_timeline_media.edges.map(
        ({ node }: any) =>
          ({
            slug: node.shortcode,
            type: extractNodeType(node),
            image: node.display_url,
            description: node.edge_media_to_caption?.edges[0]?.node?.text,
            takenAt: new Date(node.taken_at_timestamp * 1000).toISOString(),
            pinned: node.pinned_for_users && node.pinned_for_users.length > 0,
            video: node.is_video ? node.video_url : undefined,
          } as InstagramImage)
      )
    );

    console.log(`Uploading ${account}...`);
    let finalImageList: InstagramImage[] = images.filter((i) =>
      cachedResults.find((c) => c.slug === i.slug)
    );

    // Only process new media
    let newMedia = images.filter(
      (i) => !cachedResults.find((c) => c.slug === i.slug)
    );

    if (newMedia.length > 0) {
      await Promise.allSettled(
        newMedia.map((i) => uploadFile(account, i, finalImageList))
      );
      console.log(`Ended uploading ${account}`);
    } else {
      console.log(`No new media to upload for ${account}`);
    }

    // Set expiration key with 1 hour TTL (3600 seconds)
    await kv.set(expirationKey, new Date().toISOString(), { ex: 3600 });
  });

  return cachedResults;

  function extractNodeType(node: any): "carousel_album" | "video" | "image" {
    if (node.edge_sidecar_to_children) {
      return "carousel_album";
    }
    if (node.is_video) {
      return "video";
    }
    return "image";
  }
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
    let video = undefined;
    if (image.video) {
      let videoFilename = `${account}/${image.slug}.mp4`;
      let videoRequest = await fetch(image.video);
      let videoBuffer = await videoRequest.arrayBuffer();
      await s3Client.send(
        new PutObjectCommand({
          Bucket: "instagram-feed-api",
          Key: videoFilename,
          Body: Buffer.from(videoBuffer),
          CacheControl: "max-age=31536000",
        })
      );
      video = `${process.env.CDN_URL}/${videoFilename}`;
    }
    finalImageList.push({ ...image, image: filename, video });
    kv.lpush(account, { ...image, image: filename, video });
  } catch (e) {
    console.error(e);
  }
}
