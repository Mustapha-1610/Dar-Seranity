/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: "ryver.com" },
      { hostname: "seeklogo.com" },
      { hostname: "cdn-icons-png.flaticon.com" },
      { hostname: "firebasestorage.googleapis.com" },
    ],
  },
};

module.exports = nextConfig;
