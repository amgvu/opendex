import type { Metadata } from 'next'

import { Navbar } from '@/components/layout/Navbar'

export const metadata: Metadata = {
  description: 'About Opendex — a community-made Pokédex.',
  title: 'About — Opendex'
}

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl 2xl:max-w-screen-2xl p-4 pt-32 xl:pt-40">
        <h1 className="text-2xl font-semibold mb-4">About</h1>
        <p className="text-muted-foreground">
          Opendex is a community-made Pokédex. Browse all 1,025 Pokémon — stats, types, abilities,
          and more.
        </p>
      </main>
    </>
  )
}
