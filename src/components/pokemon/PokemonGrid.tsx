'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useCallback, useEffect, useRef } from 'react'

import type { Pokemon } from '@/types/pokemon'

import { usePokemon } from '@/hooks/usePokemon'
import { useSearch } from '@/hooks/useSearch'
import { useSelectedPokemon } from '@/hooks/useSelectedPokemon'
import { useSort } from '@/hooks/useSort'
import { useVirtualGrid } from '@/hooks/useVirtualGrid'

import { Input } from '../ui/input'
import { GridStatus } from './GridStatus'
import { PokemonCard } from './PokemonCard'
import { SortControls } from './SortControls'

export default function PokemonGrid() {
  const { debouncedSearch, search, setSearch } = useSearch()
  const { sortBy, sortOrder, updateSort } = useSort()
  const { fetchNextPage, hasNextPage, isFetchingNextPage, pokemon, status } =
    usePokemon(debouncedSearch, sortBy, sortOrder)
  const { selectedId, setSelectedId } = useSelectedPokemon()

  const selectedIndex = pokemon.findIndex(p => p.id === selectedId)
  const pendingNextRef = useRef(false)

  const onNext = useCallback(() => {
    const next = pokemon[selectedIndex + 1]
    if (next) {
      setSelectedId(next.id)
    } else if (hasNextPage && !isFetchingNextPage) {
      pendingNextRef.current = true
      void fetchNextPage()
    }
  }, [
    selectedIndex,
    pokemon,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    setSelectedId
  ])

  const onPrev = useCallback(() => {
    const prev = pokemon[selectedIndex - 1]
    if (prev) setSelectedId(prev.id)
  }, [selectedIndex, pokemon, setSelectedId])

  useEffect(() => {
    if (!pendingNextRef.current) return
    const next = pokemon[selectedIndex + 1]
    if (next) {
      pendingNextRef.current = false
      setSelectedId(next.id)
    }
  }, [pokemon, selectedIndex, setSelectedId])

  useEffect(() => {
    if (!selectedId) return
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'ArrowRight') onNext()
      if (e.key === 'ArrowLeft') onPrev()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [selectedId, onNext, onPrev])

  const onLoadMore = useCallback(() => void fetchNextPage(), [fetchNextPage])

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
          />
        )}
      </AnimatePresence>
      <div className="mx-auto max-w-7xl p-4">
        <Input
          className="mb-6"
          onChange={e => setSearch(e.target.value)}
          placeholder="Search Pokemon..."
          type="text"
          value={search}
        />

        <SortControls
          onSort={updateSort}
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
          <p className="py-4 text-center text-muted-foreground">
            Loading more...
          </p>
        )}
      </div>
    </>
  )
}
