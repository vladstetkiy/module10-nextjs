/** @type {import('next').NextConfig} */
const isProduction = process.env.NODE_ENV === 'production';
const isStaticExport = process.env.OUTPUT_MODE === 'export' || isProduction;

const nextConfig = {
  ...(isStaticExport && {
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
  }),
};

module.exports = nextConfig;
