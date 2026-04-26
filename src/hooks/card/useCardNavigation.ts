import { useCallback, useEffect, useMemo, useRef } from 'react'

import type { PokemonListEntry } from '@/lib/types'

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
  pokemon: PokemonListEntry[]
}) {
  const selectedName = useSelectionStore(s => s.selectedName)
  const setSelectedName = useSelectionStore(s => s.setSelectedName)
  const navigateTo = useSelectionStore(s => s.navigateTo)

  function isMobile() {
    return typeof window !== 'undefined' && window.innerWidth < 640
  }

  const selectedIndex = useMemo(
    () => pokemon.findIndex(p => p.name === selectedName),
    [pokemon, selectedName]
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
      if (isMobile()) navigateTo(next.name, 'left')
      else setSelectedName(next.name)
    } else if (hasNextPage && !isFetchingNextPage) {
      pendingNextRef.current = true
      void fetchNextPage()
    }
  }, [canNavigate, fetchNextPage, hasNextPage, isFetchingNextPage, navigateTo, pokemon, selectedIndex, setSelectedName])

  const onPrev = useCallback(() => {
    if (!canNavigate() || selectedIndex === -1) return
    const prev = pokemon[selectedIndex - 1]
    if (prev) {
      if (isMobile()) navigateTo(prev.name, 'right')
      else setSelectedName(prev.name)
    }
  }, [canNavigate, navigateTo, pokemon, selectedIndex, setSelectedName])

  useEffect(() => {
    if (!pendingNextRef.current) return
    const next = pokemon[selectedIndex + 1]
    if (next) {
      pendingNextRef.current = false
      if (isMobile()) navigateTo(next.name, 'left')
      else setSelectedName(next.name)
    }
  }, [navigateTo, pokemon, selectedIndex, setSelectedName])

  useEffect(() => {
    if (!selectedName) return
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'ArrowRight') { e.stopPropagation(); onNext() }
      else if (e.key === 'ArrowLeft') { e.stopPropagation(); onPrev() }
    }
    window.addEventListener('keydown', onKeyDown, { capture: true })
    return () => window.removeEventListener('keydown', onKeyDown, { capture: true })
  }, [onNext, onPrev, selectedName])

  return { onNext, onPrev }
}
