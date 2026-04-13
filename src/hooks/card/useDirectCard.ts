import { useCallback, useEffect, useRef } from 'react'

import type { Pokemon } from '@/types/pokemon'

import { usePokemonByIdQuery } from '@/hooks/query/usePokemonByIdQuery'

export function useDirectCard(
  selectedId: null | number,
  setSelectedId: (id: null | number) => void,
  pokemon: Pokemon[]
) {
  const fromUrlRef = useRef(selectedId !== null)

  const handleSetSelectedId = useCallback((id: null | number) => {
    fromUrlRef.current = false
    setSelectedId(id)
  }, [setSelectedId])

  const selectedInList = selectedId !== null
    ? pokemon.find(p => p.id === selectedId) ?? null
    : null

  const needsDirect = selectedId !== null && (fromUrlRef.current || selectedInList === null)

  const { pokemon: directPokemon } = usePokemonByIdQuery(needsDirect ? selectedId : null)
  const directData = needsDirect ? (selectedInList ?? directPokemon) : null

  useEffect(() => {
    const selected = directData ?? selectedInList
    document.title = selected
      ? `${selected.name.charAt(0).toUpperCase() + selected.name.slice(1)} | Opendex`
      : 'Opendex'
  }, [directData, selectedInList])

  return { directData, handleSetSelectedId, needsDirect }
}
