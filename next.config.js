/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  experimental: {
    // optimizeCss: true
  },
}


module.exports = nextConfig