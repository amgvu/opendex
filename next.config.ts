import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'picsum.photos',
        protocol: 'https'
      },
      {
        hostname: 'loremflickr.com',
        protocol: 'https'
      }
    ]
  }
}

export default nextConfig
