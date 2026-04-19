import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    minimumCacheTTL: 31536000,
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
  },
  async headers() {
    const immutable = [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }]
    return [
      { source: '/icons/:path*', headers: immutable },
      { source: '/(:path*\\.png)', headers: immutable },
      { source: '/(:path*\\.svg)', headers: immutable }
    ]
  }
}

export default nextConfig
