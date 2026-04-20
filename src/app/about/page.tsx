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
      <main className="mx-auto max-w-3xl p-4 pt-32 xl:pt-40">
        <section className="mb-12">
          <h1 className="text-3xl font-semibold mb-6">About</h1>
          <div className="space-y-3 text-muted-foreground">
            <p>
              Hi, I&apos;m Kevin. I don&apos;t really know what to put here yet,
              but thank you for using Opendex :)
            </p>
          </div>
        </section>
      </main>
    </>
  )
}
