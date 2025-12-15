/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/Module10-nextjs',
  images: { unoptimized: true },

  async rewrites() {
    return [
      {
        source: '/Module10-nextjs/mockServiceWorker.js',
        destination: '/mockServiceWorker.js',
      },
    ];
  },
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
};

module.exports = nextConfig;
