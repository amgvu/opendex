import Link from 'next/link'
import { CollectionGrid } from '@/components/collection/CollectionGrid'

export default function CollectionPage() {
  return (
    <main className="min-h-screen p-4 md:p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">My Collection</h1>
          </div>
          <nav className="flex items-center gap-4 text-sm font-medium">
            <Link
              className="text-white/50 hover:text-white transition-colors"
              href="/"
            >
              Pokédex
            </Link>
            <Link
              className="text-white/50 hover:text-white transition-colors"
              href="/battles"
            >
              Battles
            </Link>
          </nav>
        </div>
        <CollectionGrid />
      </div>
    </main>
  )
}
