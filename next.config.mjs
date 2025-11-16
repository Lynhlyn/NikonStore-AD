/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  skipTrailingSlashRedirect: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*',
      },
      {
        protocol: 'https',
        hostname: 'img.vietqr.io',
      },
      {
        protocol: 'https',
        hostname: 'api.qrserver.com',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = { fs: false, path: false };
    }
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/main/sign-in',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
