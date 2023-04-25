/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['www.wdev2.be', 'res.cloudinary.com'],
  },
  pageExtensions: ['page.tsx', 'page.ts'],
  async rewrites() {
    return [
      {
        destination: '/',
        source: '/home/',
      },
    ];
  },
  async redirects() {
    return [whatsNewRedirect];
  },
};

const whatsNewRedirect = {
  destination: '/404',
  source: '/what-is-new',
  permanent: false,
};

module.exports = nextConfig;
