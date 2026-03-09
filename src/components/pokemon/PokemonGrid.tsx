'use client'

import { AnimatePresence, motion } from 'motion/react'
import Image from 'next/image'
import { useEffect } from 'react'

import type { Pokemon } from '@/types/pokemon'

import { useCardNavigation } from '@/hooks/useCardNavigation'
import { useFilters } from '@/hooks/useFilters'
import { usePokemon } from '@/hooks/usePokemon'
import { useSearch } from '@/hooks/useSearch'
import { useSelectedPokemon } from '@/hooks/useSelectedPokemon'
import { useSort } from '@/hooks/useSort'
import { useVirtualGrid } from '@/hooks/useVirtualGrid'

import { PokemonCard } from './card/PokemonCard'
import { PokemonToolbar } from './controls/PokemonToolbar'
import { GridStatus } from './GridStatus'

export default function PokemonGrid() {
  const { debouncedSearch, search, setSearch } = useSearch()
  const { sortBy, sortOrder, updateSort } = useSort()
  const { selectedGens, selectedTypes, toggleGen, toggleType } = useFilters()

  const { hasNextPage, isFetchingNextPage, loadMore, pokemon, status } =
    usePokemon(debouncedSearch, sortBy, sortOrder, selectedTypes, selectedGens)
  const { selectedId, setSelectedId } = useSelectedPokemon()

  const { onNext, onPrev } = useCardNavigation({
    fetchNextPage: loadMore,
    hasNextPage,
    isFetchingNextPage,
    pokemon,
    selectedId,
    setSelectedId
  })

  useEffect(() => {
    const selected = pokemon.find(p => p.id === selectedId)
    document.title = selected
      ? `${selected.name.charAt(0).toUpperCase() + selected.name.slice(1)} | Finnédex`
      : 'Finnédex'
  }, [selectedId, pokemon])

  const { columns, getRowPokemon, measureElement, totalHeight, virtualItems } =
    useVirtualGrid(
      pokemon,
      selectedId,
      loadMore,
      hasNextPage,
      isFetchingNextPage
    )

  return (
    <>
      <AnimatePresence>
        {selectedId && (
          <motion.div
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-40 bg-black/40"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            onClick={() => setSelectedId(null)}
          />
        )}
      </AnimatePresence>
      <div className="mx-auto max-w-7xl p-4">
        <div className="mb-6 flex items-center gap-2">
          <Image
            alt=""
            aria-hidden="true"
            className="h-8 w-8"
            height={64}
            src="/pokemon-icon.svg"
            unoptimized
            width={64}
          />
          <h1 className="text-2xl font-bold tracking-tight">Finnédex</h1>
        </div>
        <PokemonToolbar
          onToggleGen={toggleGen}
          onToggleType={toggleType}
          onUpdateSearch={setSearch}
          onUpdateSort={updateSort}
          search={search}
          selectedGens={selectedGens}
          selectedTypes={selectedTypes}
          sortBy={sortBy}
          sortOrder={sortOrder}
        />

        <GridStatus
          empty={status === 'success' && pokemon.length === 0}
          status={status}
        />

        <div className="relative w-full" style={{ height: totalHeight }}>
          {virtualItems.map(row => (
            <div
              className="absolute left-0 top-0 w-full"
              data-index={row.index}
              key={row.index}
              ref={measureElement as (node: HTMLDivElement | null) => void}
              style={{
                display: 'grid',
                gap: 16,
                gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                paddingBottom: 16,
                transform: `translateY(${row.start}px)`
              }}
            >
              {getRowPokemon(row.index).map((p: Pokemon) => (
                <PokemonCard
                  active={selectedId === p.id}
                  key={p.id}
                  onClick={() => setSelectedId(p.id)}
                  onClose={() => setSelectedId(null)}
                  onNext={onNext}
                  onPrev={onPrev}
                  pokemon={p}
                />
              ))}
            </div>
          ))}
        </div>

        {isFetchingNextPage && (
          <div className="flex justify-center py-4">
            <Image
              alt="Loading"
              className="h-8 w-8 animate-spin grayscale"
              height={64}
              src="/pokemon-icon.svg"
              width={64}
            />
          </div>
        )}
      </div>
    </>
  )
}
