import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname
  },
  images: {
    remotePatterns: [
      {
        hostname: 'picsum.photos',
        protocol: 'https'
      },
      {
        hostname: 'loremflickr.com',
        protocol: 'https'
      },
      {
        hostname: 'raw.githubusercontent.com',
        protocol: 'https'
      },
      {
        hostname: 'play.pokemonshowdown.com',
        protocol: 'https'
      }
    ]
  }
}

export default nextConfig
