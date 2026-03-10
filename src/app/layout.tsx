import type { Metadata } from 'next'

import { SpeedInsights } from '@vercel/speed-insights/next'
import { Geist, Geist_Mono } from 'next/font/google'

import { QueryProvider } from '@/components/providers/QueryProvider'

import './globals.css'

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans'
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono'
})

export const metadata: Metadata = {
  description: 'Fast, interactive Pokémon explorer',
  title: 'Opendex'
}

const POKEMON_TYPES = [
  'bug',
  'dark',
  'dragon',
  'electric',
  'fairy',
  'fighting',
  'fire',
  'flying',
  'ghost',
  'grass',
  'ground',
  'ice',
  'normal',
  'poison',
  'psychic',
  'rock',
  'steel',
  'water'
]

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        {POKEMON_TYPES.map(type => (
          <link
            as="image"
            href={`/icons/${type}.svg`}
            key={type}
            rel="preload"
          />
        ))}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} dark antialiased`}
      >
        <SpeedInsights />
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  )
}
