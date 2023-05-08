/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  // images: {
  //   domains: ['assets.acme.com'],
  //   remotePatterns: [
  //     {
  //       protocol: "https",
  //       hostname: "**.cdninstagram.com",
  //     },
  //   ],
  // },
};

module.exports = nextConfig;
