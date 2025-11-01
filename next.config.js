/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    // Ignore ESLint warnings during build (inline styles are required for dynamic data)
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'https://backend-store-luxury-4.onrender.com'
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
      {
        source: '/images/:path*',
        destination: `${backendUrl}/images/:path*`,
      },
    ]
  },
}

module.exports = nextConfig
