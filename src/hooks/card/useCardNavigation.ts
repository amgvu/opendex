import { useCallback, useEffect, useRef } from 'react'

import type { PokemonEntry, PokemonVariant } from '@/types/pokemon'

import { useSelectionStore } from '@/stores/selectionStore'

export function useCardNavigation({
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  pokemon
}: {
  fetchNextPage: () => void
  hasNextPage: boolean
  isFetchingNextPage: boolean
  pokemon: PokemonEntry[]
}) {
  const selectedId = useSelectionStore(s => s.selectedId)
  const selectedVariantIndex = useSelectionStore(s => s.selectedVariantIndex)
  const setSelectedId = useSelectionStore(s => s.setSelectedId)

  const selectedIndex = pokemon.findIndex(
    p =>
      p.id === selectedId &&
      ((p as PokemonVariant).variantIndex ?? null) === selectedVariantIndex
  )
  const pendingNextRef = useRef(false)
  const lastNavTimeRef = useRef(0)

  const canNavigate = useCallback(() => {
    const now = Date.now()
    if (now - lastNavTimeRef.current < 100) return false
    lastNavTimeRef.current = now
    return true
  }, [])

  const onNext = useCallback(() => {
    if (!canNavigate() || selectedIndex === -1) return
    const next = pokemon[selectedIndex + 1]
    if (next) {
      setSelectedId(next.id, (next as PokemonVariant).variantIndex ?? null)
    } else if (hasNextPage && !isFetchingNextPage) {
      pendingNextRef.current = true
      void fetchNextPage()
    }
  }, [canNavigate, fetchNextPage, hasNextPage, isFetchingNextPage, pokemon, selectedIndex, setSelectedId])

  const onPrev = useCallback(() => {
    if (!canNavigate() || selectedIndex === -1) return
    const prev = pokemon[selectedIndex - 1]
    if (prev) setSelectedId(prev.id, (prev as PokemonVariant).variantIndex ?? null)
  }, [canNavigate, pokemon, selectedIndex, setSelectedId])

  useEffect(() => {
    if (!pendingNextRef.current) return
    const next = pokemon[selectedIndex + 1]
    if (next) {
      pendingNextRef.current = false
      setSelectedId(next.id, (next as PokemonVariant).variantIndex ?? null)
    }
  }, [pokemon, selectedIndex, setSelectedId])

  useEffect(() => {
    if (!selectedId) return
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'ArrowRight') { e.stopPropagation(); onNext() }
      else if (e.key === 'ArrowLeft') { e.stopPropagation(); onPrev() }
    }
    window.addEventListener('keydown', onKeyDown, { capture: true })
    return () => window.removeEventListener('keydown', onKeyDown, { capture: true })
  }, [onNext, onPrev, selectedId])

  return { onNext, onPrev }
}
