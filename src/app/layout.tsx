import type { Metadata } from 'next'

import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { IBM_Plex_Mono, IBM_Plex_Sans } from 'next/font/google'

import { QueryProvider } from '@/components/providers/QueryProvider'

import './globals.css'

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  variable: '--font-ibm-plex-sans',
  weight: ['400', '500', '700']
})

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  variable: '--font-ibm-plex-mono',
  weight: ['400', '700']
})

export const metadata: Metadata = {
  description:
    'Community-made Pokédex. Browse all 1,025 Pokémon - stats, types, abilities, and more.',
  title: 'Opendex'
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
