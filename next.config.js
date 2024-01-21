/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: "firebasestorage.googleapis.com" },
      { hostname: "cdn.discordapp.com" },
    ],
  },
};

module.exports = nextConfig;
