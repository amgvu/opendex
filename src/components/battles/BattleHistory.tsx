'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchBattleHistory } from '@/lib/api'
import { BattleCard } from './BattleCard'

export function BattleHistory() {
  const [page, setPage] = useState(1)
  const { data, status } = useQuery({
    queryKey: ['battles', page],
    queryFn: () => fetchBattleHistory(page),
    staleTime: 10_000,
    refetchInterval: (query) => {
      const items = query.state.data?.items ?? []
      const hasLive = items.some(b => b.status === 'active' || b.status === 'queued')
      return hasLive ? 3_000 : false
    },
  })

  if (status === 'pending') {
    return <div className="text-white/40 text-sm">Loading battles…</div>
  }

  if (!data || data.items.length === 0) {
    return <div className="text-white/40 text-sm">No battles yet. Start one above!</div>
  }

  return (
    <div className="space-y-3">
      {data.items.map(battle => (
        <BattleCard key={battle.battleId} battle={battle} />
      ))}

      {(data.hasMore || page > 1) && (
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            className="rounded-lg px-3 py-1 text-sm text-white/50 hover:text-white disabled:opacity-20"
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
          >
            ← Prev
          </button>
          <span className="text-xs text-white/30">Page {page}</span>
          <button
            className="rounded-lg px-3 py-1 text-sm text-white/50 hover:text-white disabled:opacity-20"
            disabled={!data.hasMore}
            onClick={() => setPage(p => p + 1)}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  )
}
