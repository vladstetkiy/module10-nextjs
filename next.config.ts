/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/module10-nextjs',
  async rewrites() {
    return [
      {
        source: '/Module10-nextjs/mockServiceWorker.js',
        destination: '/mockServiceWorker.js',
      },
    ];
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  experimental: {
    workerThreads: false,
    cpus: 1,
  },

  images: {
    unoptimized: true,
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
