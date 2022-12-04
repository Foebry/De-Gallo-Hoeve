/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["www.wdev2.be", "res.cloudinary.com"],
  },
  // trailingSlash: true,
  pageExtensions: ["page.tsx", "page.ts"],
  exportPathMap: async (defaultPathMap) => {
    return {
      "/index/index/index.html": { page: "/" },
    };
  },
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
