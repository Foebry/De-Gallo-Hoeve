/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["www.wdev2.be", "res.cloudinary.com"],
  },
  // trailingSlash: true,
  pageExtensions: ["page.tsx", "page.ts"],
  rewrites: async () => {
    return [
      {
        destination: "/home/",
        source: "/",
      },
    ];
  },
};

module.exports = nextConfig;
