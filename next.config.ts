import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/module10-nextjs',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
