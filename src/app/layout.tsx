import type { Metadata } from 'next'

import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { IBM_Plex_Mono, IBM_Plex_Sans } from 'next/font/google'

import { QueryProvider } from '@/components/providers/QueryProvider'

import './globals.css'

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  variable: '--font-ibm-plex-sans',
  weight: [
    '100', // Thin
    '200', // Extra Light
    '300', // Light
    '400', // Regular
    '500', // Medium
    '600', // Semi Bold
    '700' // Bold
  ]
})

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  variable: '--font-ibm-plex-mono',
  weight: [
    '100', // Thin
    '200', // Extra Light
    '300', // Light
    '400', // Regular
    '500', // Medium
    '600', // Semi Bold
    '700' // Bold
  ]
})

export const metadata: Metadata = {
  description:
    'Community-made Pokédex. Browse all 1,025 Pokémon - stats, types, abilities, and more.',
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
        className={`${ibmPlexSans.variable} ${ibmPlexMono.variable} font-sans dark antialiased`}
      >
        <Analytics />
        <SpeedInsights />
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  )
}
