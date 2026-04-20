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
          Hi! Thanks for using Opendex. This page is mostly under construction
          until I figure out what I want to say, so enjoy the app in the
          meantime and reach out to me on Discord at amg00 if you have any
          feedback!
        </p>
      </main>
    </>
  )
}
