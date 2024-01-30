/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,

  images: {
    remotePatterns: [
      { hostname: "firebasestorage.googleapis.com" },
      { hostname: "cdn.discordapp.com" },
    ],
  },
};

module.exports = nextConfig;
