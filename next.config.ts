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
  async rewrites() {
    return [
      {
        source: '/api/documents/:path*',
        destination: 'http://127.0.0.1:8000/api/documents/:path*',
      },
    ];
  },
};

export default nextConfig;
