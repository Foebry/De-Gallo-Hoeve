/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["www.wdev2.be", "res.cloudinary.com"],
  },
  pageExtensions: ["page.tsx", "page.ts"],
  rewrites: async () => {
    return [
      {
        destination: "/index/",
        source: "/",
      },
    ];
  },
};

module.exports = nextConfig;
