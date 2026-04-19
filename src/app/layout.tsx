import type { Metadata } from 'next'

import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { IBM_Plex_Mono, Open_Sans } from 'next/font/google'

import { QueryProvider } from '@/components/providers/QueryProvider'
import { DEFAULT_METADATA, generatePokemonMetadata } from '@/lib/metadata'
import { getPokemonByName } from '@/lib/pokemon-metadata'

import './globals.css'

const ibmPlexSans = Open_Sans({
  subsets: ['latin'],
  variable: '--font-ibm-plex-sans',
  weight: ['400', '500', '600', '700']
})

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  variable: '--font-ibm-plex-mono',
  weight: ['400', '500', '600', '700']
})

export async function generateMetadata({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}): Promise<Metadata> {
  try {
    const params = await searchParams
    const pokemonName = params?.pokemon

    if (!pokemonName || typeof pokemonName !== 'string') {
      return DEFAULT_METADATA
    }

    const pokemon = getPokemonByName(pokemonName)
    return pokemon ? generatePokemonMetadata(pokemon) : DEFAULT_METADATA
  } catch {
    return DEFAULT_METADATA
  }
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head />
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
