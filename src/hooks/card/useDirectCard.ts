import { useEffect } from 'react'

import type { Pokemon } from '@/types/pokemon'

import { usePokemonByIdQuery } from '@/hooks/query/usePokemonByIdQuery'
import { useSelectionStore } from '@/stores/selectionStore'

export function useDirectCard(pokemon: Pokemon[]) {
  const selectedId = useSelectionStore(s => s.selectedId)
  const fromUrl = useSelectionStore(s => s.fromUrl)

  const selectedInList = selectedId !== null
    ? pokemon.find(p => p.id === selectedId) ?? null
    : null

  const needsDirect = selectedId !== null && (fromUrl || selectedInList === null)

  const { pokemon: directPokemon } = usePokemonByIdQuery(needsDirect ? selectedId : null)
  const directData = needsDirect ? (selectedInList ?? directPokemon) : null

  useEffect(() => {
    const selected = directData ?? selectedInList
    document.title = selected
      ? `${selected.name.charAt(0).toUpperCase() + selected.name.slice(1)} | Opendex`
      : 'Opendex'
  }, [directData, selectedInList])

  return { directData, needsDirect }
}
