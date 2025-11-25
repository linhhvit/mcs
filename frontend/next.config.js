/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_URL: process.env.API_BASE_URL || 'http://localhost:8000',
  },
}

module.exports = nextConfig

