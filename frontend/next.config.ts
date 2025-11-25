import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Use standalone for production, normal mode for development
  ...(process.env.NODE_ENV === 'production' ? { output: 'standalone' } : {}),
  reactStrictMode: true,
  // Environment variables are automatically available via process.env.NEXT_PUBLIC_*
  // No need to manually set them here - Next.js handles it automatically
};

export default nextConfig;
