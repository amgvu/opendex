'use client'

import { AnimatePresence, motion, useScroll, useTransform } from 'motion/react'
import Image from 'next/image'

import type { PokemonEntry, PokemonVariant } from '@/types/pokemon'

import { Button } from '@/components/ui/button'
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
  const selectedId = useSelectionStore(s => s.selectedId)
  const selectedVariantIndex = useSelectionStore(s => s.selectedVariantIndex)
  const setSelectedId = useSelectionStore(s => s.setSelectedId)

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

  const { scrollY } = useScroll()
  const titleHeight = useTransform(scrollY, [0, 48], [44, 0])
  const titleOpacity = useTransform(scrollY, [0, 32], [1, 0])

  const { columns, getRowPokemon, measureElement, totalHeight, virtualItems } =
    useVirtualGrid(pokemon, loadMore, hasNextPage, isFetchingNextPage)

  return (
    <NavProvider onNext={onNext} onPrev={onPrev}>
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
      {needsDirect && directData && <DirectCard pokemon={directData} />}
      <div className="fixed inset-x-0 top-0 z-30 bg-background/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl 2xl:max-w-screen-2xl px-4 py-3 2xl:px-6 2xl:py-4">
          <motion.div
            className="overflow-hidden"
            style={{ height: titleHeight, opacity: titleOpacity }}
          >
            <div className="mb-3 2xl:mb-4 flex items-center justify-between">
              <a href="/">
                <Image
                  alt="Opendex"
                  className="h-6 w-auto"
                  height={128}
                  src="/opendex.png"
                  unoptimized
                  width={128}
                />
              </a>
              <Button asChild size="sm" variant="outline">
                <a
                  href="https://ko-fi.com/amgdev"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  ☕ Support on Ko-fi
                </a>
              </Button>
            </div>
          </motion.div>
          <PokemonToolbar />
        </div>
      </div>
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
                  active={
                    !needsDirect &&
                    selectedId === p.id &&
                    selectedVariantIndex === ((p as PokemonVariant).variantIndex ?? null)
                  }
                  index={row.index * columns + i}
                  key={p.name}
                  onClick={() => setSelectedId(p.id, (p as PokemonVariant).variantIndex ?? null)}
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
