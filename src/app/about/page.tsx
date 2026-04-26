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
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              Hi, I&apos;m Kevin! This started as a take-home interview project,
              but after lots of positive feedback from Pokemon fans, I decided
              to ship Opendex and turn it into something people can use.
            </p>
            <p>
              My goal for this app is to be a comprehensive, easy-to-use
              resource for Pokemon lore and data, with a strong focus on user
              experience. Some features are already in development and planned
              to release very soon, such as battle simulation and Champions
              related tools.
            </p>
            <p>
              I didn&apos;t actually know much about Pokemon going into this,
              but I enjoy building in new domains, so I&apos;m shaping Opendex
              into something even the most passionate fans will enjoy using.
            </p>
            <p>
              Something missing? A feature you&apos;d love to see? Reach out to
              me directly on Discord at amg00
            </p>
          </div>
        </section>
      </main>
    </>
  )
}
