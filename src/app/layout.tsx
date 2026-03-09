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
  description: 'Fast, interactive Pokémon browser',
  title: 'Pokédex'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} dark antialiased`}
      >
        <SpeedInsights />
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  )
}
