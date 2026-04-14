import { useCallback, useEffect, useRef, useTransition } from 'react'

import type { Pokemon } from '@/types/pokemon'

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
  pokemon: Pokemon[]
}) {
  const selectedId = useSelectionStore(s => s.selectedId)
  const setSelectedId = useSelectionStore(s => s.setSelectedId)

  const selectedIndex = pokemon.findIndex(p => p.id === selectedId)
  const pendingNextRef = useRef(false)
  const lastNavTimeRef = useRef(0)
  const [, startTransition] = useTransition()

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
      startTransition(() => setSelectedId(next.id))
    } else if (hasNextPage && !isFetchingNextPage) {
      pendingNextRef.current = true
      void fetchNextPage()
    }
  }, [canNavigate, fetchNextPage, hasNextPage, isFetchingNextPage, pokemon, selectedIndex, setSelectedId, startTransition])

  const onPrev = useCallback(() => {
    if (!canNavigate() || selectedIndex === -1) return
    const prev = pokemon[selectedIndex - 1]
    if (prev) startTransition(() => setSelectedId(prev.id))
  }, [canNavigate, pokemon, selectedIndex, setSelectedId, startTransition])

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
      if (e.key === 'ArrowRight') { e.stopPropagation(); onNext() }
      else if (e.key === 'ArrowLeft') { e.stopPropagation(); onPrev() }
    }
    window.addEventListener('keydown', onKeyDown, { capture: true })
    return () => window.removeEventListener('keydown', onKeyDown, { capture: true })
  }, [onNext, onPrev, selectedId])

  return { onNext, onPrev }
}
