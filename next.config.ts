/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/module10-nextjs',
  images: { unoptimized: true },

  async rewrites() {
    return [
      {
        source: '/Module10-nextjs/mockServiceWorker.js',
        destination: '/mockServiceWorker.js',
      },
    ];
  },
};

module.exports = nextConfig;
