/** @type {import('next').NextConfig} */
const nextConfig = {
  // Simplified configuration for Vercel deployment
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'academic-platform.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
    ],
  },

  // Environment variables
  env: {
    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
    NEXT_PUBLIC_API_KEY:
      process.env.NEXT_PUBLIC_API_KEY ||
      'a05a30d9a9334856e510716d590db51e9b1cd9508459cc0891b162e3f6fa814d',
    NEXT_PUBLIC_APP_URL:
      process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  },

  // Configure webpack for deployment
  webpack: (config, { dev, isServer }) => {
    // Fix for deployment issues
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };

    return config;
  },
};

module.exports = nextConfig;
