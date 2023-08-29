import { Redis } from "@upstash/redis";

if (!process.env.KV_URL || !process.env.KV_TOKEN) throw "env not found";

declare global {
  // eslint-disable-next-line no-var
  var kv: Redis | undefined;
}

export const kv =
  global.kv ||
  new Redis({
    url: process.env.KV_URL,
    token: process.env.KV_TOKEN,
  });

if (process.env.NODE_ENV !== "production") {
  global.kv = kv;
}
