/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    after: true,
  },
  serverExternalPackages: ["prisma", "@temporalio/client"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "d2b8b46ja6xujp.cloudfront.net",
      },
      {
        protocol: "https",
        hostname: "**.fbcdn.net",
      },
    ],
  },
};

module.exports = nextConfig;
