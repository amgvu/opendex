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

  const onNext = useCallback(() => {
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
      if (e.key === 'ArrowRight') onNext()
      if (e.key === 'ArrowLeft') onPrev()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onNext, onPrev, selectedId])

  return { onNext, onPrev }
}
