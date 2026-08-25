import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  // Suppress hydration warnings from theme attribute
  compiler: {
    styledComponents: false,
  },
  output: 'standalone',
  async redirects() {
    return [
      {
        source: '/auth/login',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
