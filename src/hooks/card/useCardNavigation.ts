import { useCallback, useEffect, useRef } from 'react'

import type { Pokemon } from '@/types/pokemon'

export function useCardNavigation({
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  pokemon,
  selectedId,
  setSelectedId
}: {
  fetchNextPage: () => void
  hasNextPage: boolean
  isFetchingNextPage: boolean
  pokemon: Pokemon[]
  selectedId: null | number
  setSelectedId: (id: null | number) => void
}) {
  const selectedIndex = pokemon.findIndex(p => p.id === selectedId)
  const pendingNextRef = useRef(false)
  const lastNavTimeRef = useRef(0)

  const canNavigate = () => {
    const now = Date.now()
    if (now - lastNavTimeRef.current < 100) return false
    lastNavTimeRef.current = now
    return true
  }

  const onNext = useCallback(() => {
    if (!canNavigate() || selectedIndex === -1) return
    const next = pokemon[selectedIndex + 1]
    if (next) {
      setSelectedId(next.id)
    } else if (hasNextPage && !isFetchingNextPage) {
      pendingNextRef.current = true
      void fetchNextPage()
    }
  }, [
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    pokemon,
    selectedIndex,
    setSelectedId
  ])

  const onPrev = useCallback(() => {
    if (!canNavigate() || selectedIndex === -1) return
    const prev = pokemon[selectedIndex - 1]
    if (prev) setSelectedId(prev.id)
  }, [pokemon, selectedIndex, setSelectedId])

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
