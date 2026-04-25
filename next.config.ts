import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async headers() {
    const immutable = [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }]
    return [
      { headers: immutable, source: '/icons/:path*' },
      { headers: immutable, source: '/artwork/:path*' },
      { headers: immutable, source: '/(:path*\\.png)' },
      { headers: immutable, source: '/(:path*\\.svg)' },
      { headers: immutable, source: '/(:path*\\.webp)' }
    ]
  },
  images: {
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        hostname: 'play.pokemonshowdown.com',
        protocol: 'https'
      }
    ]
  }
}

export default nextConfig
