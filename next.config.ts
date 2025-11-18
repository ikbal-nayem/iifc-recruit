
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  i18n: {
    locales: ['en', 'bn'],
    defaultLocale: 'en',
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api-rms.iifc.gov.bd',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api-stage-recruit.iifc.gov.bd',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
