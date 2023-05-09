/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    domains: ["d2b8b46ja6xujp.cloudfront.net"],
  },
};

module.exports = nextConfig;
