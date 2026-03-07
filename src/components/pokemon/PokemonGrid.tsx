'use client'

import { useState } from 'react'

import type { Pokemon } from '@/types/pokemon'

import { usePokemon } from '@/hooks/usePokemon'
import { useSearch } from '@/hooks/useSearch'
import { getTypeColor } from '@/lib/pokemon'

import { Input } from '../ui/input'
import { PokemonModal } from './PokemonModal'

export default function PokemonGrid() {
  const { debouncedSearch, search, setSearch } = useSearch()
  const { isFetchingNextPage, pokemon, sentinelRef, status } =
    usePokemon(debouncedSearch)
  const [selected, setSelected] = useState<null | Pokemon>(null)

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

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {pokemon.map((p: Pokemon) => (
          <div
            className="cursor-pointer rounded-xl border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
            key={p.id}
            onClick={() => setSelected(p)}
          >
            <p className="font-semibold capitalize">{p.name}</p>
            <div className="mt-2 flex flex-wrap gap-1">
              {p.types.map((type: string) => (
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium text-white ${getTypeColor(type)}`}
                  key={type}
                >
                  {type}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="h-8" ref={sentinelRef} />

      {isFetchingNextPage && (
        <p className="py-4 text-center text-muted-foreground">
          Loading more...
        </p>
      )}

      <PokemonModal onClose={() => setSelected(null)} pokemon={selected} />
    </div>
  )
}
