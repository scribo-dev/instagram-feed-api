/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["prisma", "@temporalio/client"],
  },
  images: {
    domains: ["d2b8b46ja6xujp.cloudfront.net"],
  },
};

module.exports = nextConfig;
