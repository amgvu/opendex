import Link from 'next/link'

import { BattleHistory } from '@/components/battles/BattleHistory'
import { StartBattle } from '@/components/battles/StartBattle'

export default function BattlesPage() {
  return (
    <main className="min-h-screen p-4 md:p-6">
      <div className="mx-auto max-w-3xl space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Battles</h1>
            <p className="text-sm text-white/50 mt-1">
              Pick two Pokemon and let them battle!
            </p>
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
              href="/collection"
            >
              Collection
            </Link>
          </nav>
        </div>

        {/* Start a battle */}
        <section className="rounded-2xl bg-white/5 p-4 space-y-3">
          <h2 className="text-sm font-semibold text-white/60 uppercase tracking-widest">
            Start a Battle
          </h2>
          <StartBattle />
        </section>

        {/* Battle history */}
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-white/60 uppercase tracking-widest">
            Battle History
          </h2>
          <BattleHistory />
        </section>
      </div>
    </main>
  )
}
