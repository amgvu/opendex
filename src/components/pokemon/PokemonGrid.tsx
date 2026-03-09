'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { TbAdjustments } from 'react-icons/tb'

import type { Pokemon } from '@/types/pokemon'

import { useCardNavigation } from '@/hooks/useCardNavigation'
import { useFilters } from '@/hooks/useFilters'
import { usePokemon } from '@/hooks/usePokemon'
import { useSearch } from '@/hooks/useSearch'
import { useSelectedPokemon } from '@/hooks/useSelectedPokemon'
import { useSort } from '@/hooks/useSort'
import { useVirtualGrid } from '@/hooks/useVirtualGrid'

import { Input } from '../ui/input'
import { FilterControls } from './FilterControls'
import { GridStatus } from './GridStatus'
import { PokemonCard } from './PokemonCard'
import { SortControls } from './SortControls'

export default function PokemonGrid() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { debouncedSearch, search, setSearch } = useSearch()
  const { sortBy, sortOrder, updateSort } = useSort()
  const { selectedGens, selectedTypes, toggleGen, toggleType } = useFilters()

  const activeCount =
    selectedTypes.length +
    selectedGens.length +
    (sortBy !== 'id' || sortOrder !== 'asc' ? 1 : 0)
  const { fetchNextPage, hasNextPage, isFetchingNextPage, pokemon, status } =
    usePokemon(debouncedSearch, sortBy, sortOrder, selectedTypes, selectedGens)
  const { selectedId, setSelectedId } = useSelectedPokemon()

  const { onNext, onPrev } = useCardNavigation({
    fetchNextPage: () => {
      void fetchNextPage()
    },
    hasNextPage,
    isFetchingNextPage,
    pokemon,
    selectedId,
    setSelectedId
  })

  const onLoadMore = () => {
    void fetchNextPage()
  }

  useEffect(() => {
    const selected = pokemon.find(p => p.id === selectedId)
    document.title = selected
      ? `${selected.name.charAt(0).toUpperCase() + selected.name.slice(1)} | Finnydex`
      : 'Finnydex'
  }, [selectedId, pokemon])

  const { columns, getRowPokemon, totalHeight, virtualItems } = useVirtualGrid(
    pokemon,
    onLoadMore,
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
        <Input
          className="mb-4"
          onChange={e => setSearch(e.target.value)}
          placeholder="Search Pokemon..."
          type="text"
          value={search}
        />

        <button
          className="mb-4 flex items-center gap-2 rounded-lg bg-muted px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted/70"
          onClick={() => setDrawerOpen(o => !o)}
        >
          <TbAdjustments size={14} />
          Sort &amp; Filter
          <span
            className={`rounded-full bg-foreground px-1.5 py-0.5 text-xs text-background transition-opacity ${activeCount > 0 ? 'opacity-100' : 'opacity-0'}`}
          >
            {activeCount || 0}
          </span>
        </button>

        <AnimatePresence initial={false}>
          {drawerOpen && (
            <motion.div
              animate={{ height: 'auto', opacity: 1 }}
              className="overflow-hidden"
              exit={{ height: 0, opacity: 0 }}
              initial={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
            >
              <div>
                <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">
                  Sort
                </p>
                <SortControls
                  onSort={updateSort}
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                />
                <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">
                  Filter
                </p>
                <FilterControls
                  onToggleGen={toggleGen}
                  onToggleType={toggleType}
                  selectedGens={selectedGens}
                  selectedTypes={selectedTypes}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <GridStatus
          empty={status === 'success' && pokemon.length === 0}
          status={status}
        />

        <div className="relative w-full" style={{ height: totalHeight }}>
          {virtualItems.map(row => (
            <div
              className="absolute left-0 top-0 w-full"
              key={row.index}
              style={{
                display: 'grid',
                gap: 16,
                gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                height: row.size,
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
            <img alt="Loading" className="h-8 w-8 animate-spin grayscale" src="/pokemon-icon.svg" />
          </div>
        )}
      </div>
    </>
  )
}
