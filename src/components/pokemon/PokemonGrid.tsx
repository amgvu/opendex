'use client'

import { useCallback, useState } from 'react'

import type { Pokemon } from '@/types/pokemon'

import { usePokemon } from '@/hooks/usePokemon'
import { useSearch } from '@/hooks/useSearch'
import { useVirtualGrid } from '@/hooks/useVirtualGrid'

import { Input } from '../ui/input'
import { PokemonCard } from './PokemonCard'

export default function PokemonGrid() {
  const { debouncedSearch, search, setSearch } = useSearch()
  const { fetchNextPage, hasNextPage, isFetchingNextPage, pokemon, status } =
    usePokemon(debouncedSearch)
  const [selectedId, setSelectedId] = useState<null | number>(null)

  const onLoadMore = useCallback(() => {
    void fetchNextPage()
  }, [fetchNextPage])

  const { columns, getRowPokemon, totalHeight, virtualItems } = useVirtualGrid(
    pokemon,
    onLoadMore,
    hasNextPage,
    isFetchingNextPage
  )

  return (
    <div className="mx-auto max-w-7xl p-4">
      <Input
        className="mb-6"
        onChange={e => setSearch(e.target.value)}
        placeholder="Search Pokemon..."
        type="text"
        value={search}
      />

      {status === 'pending' && <p className="text-center">Loading...</p>}
      {status === 'error' && (
        <p className="text-center text-red-500">Failed to load Pokemon.</p>
      )}
      {status === 'success' && pokemon.length === 0 && (
        <p className="text-center text-muted-foreground">No Pokemon found.</p>
      )}

      <div className="relative w-full" style={{ height: totalHeight }}>
        {virtualItems.map(row => (
          <div
            className="absolute left-0 top-0 w-full"
            key={row.index}
            style={{
              display: 'grid',
              gap: 16,
              gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
              height: row.size - 16,
              transform: `translateY(${row.start}px)`
            }}
          >
            {getRowPokemon(row.index).map((p: Pokemon) => (
              <PokemonCard
                active={selectedId === p.id}
                key={p.id}
                onClick={() => setSelectedId(p.id)}
                onClose={() => setSelectedId(null)}
                pokemon={p}
              />
            ))}
          </div>
        ))}
      </div>

      {isFetchingNextPage && (
        <p className="py-4 text-center text-muted-foreground">
          Loading more...
        </p>
      )}
    </div>
  )
}
