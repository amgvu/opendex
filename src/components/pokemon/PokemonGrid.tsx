'use client'

import { AnimatePresence, motion } from 'motion/react'
import Image from 'next/image'

import type { PokemonEntry } from '@/types/pokemon'

import { Navbar } from '@/components/layout/Navbar'
import { NavProvider } from '@/context/navigation'
import { useCardNavigation } from '@/hooks/card/useCardNavigation'
import { useDirectCard } from '@/hooks/card/useDirectCard'
import { useFilters } from '@/hooks/filters/useFilters'
import { useSearch } from '@/hooks/filters/useSearch'
import { useSelectedPokemon } from '@/hooks/filters/useSelectedPokemon'
import { useSort } from '@/hooks/filters/useSort'
import { usePokemonQuery } from '@/hooks/query/usePokemonQuery'
import { useVirtualGrid } from '@/hooks/virtual/useVirtualGrid'
import { useFilterStore } from '@/stores/filterStore'
import { useSelectionStore } from '@/stores/selectionStore'

import { DirectCard } from './card/DirectCard'
import { PokemonCard } from './card/PokemonCard'
import { PokemonToolbar } from './controls/PokemonToolbar'
import { GridStatus } from './GridStatus'

export default function PokemonGrid() {
  // URL sync — side-effect only
  useSearch()
  useSort()
  useFilters()
  useSelectedPokemon()

  const debouncedSearch = useFilterStore(s => s.debouncedSearch)
  const sortBy = useFilterStore(s => s.sortBy)
  const sortOrder = useFilterStore(s => s.sortOrder)
  const selectedTypes = useFilterStore(s => s.selectedTypes)
  const selectedGens = useFilterStore(s => s.selectedGens)
  const selectedName = useSelectionStore(s => s.selectedName)
  const setSelectedName = useSelectionStore(s => s.setSelectedName)

  const { hasNextPage, isFetchingNextPage, loadMore, pokemon, status } =
    usePokemonQuery(
      debouncedSearch,
      sortBy,
      sortOrder,
      selectedTypes,
      selectedGens
    )

  const { directData, needsDirect } = useDirectCard(pokemon)

  const { onNext, onPrev } = useCardNavigation({
    fetchNextPage: loadMore,
    hasNextPage,
    isFetchingNextPage,
    pokemon
  })

  const { columns, getRowPokemon, measureElement, totalHeight, virtualItems } =
    useVirtualGrid(pokemon, loadMore, hasNextPage, isFetchingNextPage)

  return (
    <NavProvider onNext={onNext} onPrev={onPrev}>
      <AnimatePresence>
        {selectedName && (
          <motion.div
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-40 bg-black/40"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            onClick={() => setSelectedName(null)}
          />
        )}
      </AnimatePresence>
      {needsDirect && directData && <DirectCard pokemon={directData} />}
      <Navbar>
        <PokemonToolbar />
      </Navbar>
      <div className="mx-auto max-w-7xl 2xl:max-w-screen-2xl p-4 pt-32 xl:pt-40">
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
              {getRowPokemon(row.index).map((p: PokemonEntry, i: number) => (
                <PokemonCard
                  active={!needsDirect && selectedName === p.name}
                  index={row.index * columns + i}
                  key={p.name}
                  onClick={() => setSelectedName(p.name)}
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
    </NavProvider>
  )
}
