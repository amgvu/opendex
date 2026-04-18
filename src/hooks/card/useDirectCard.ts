import { useEffect } from 'react'

import type { PokemonEntry } from '@/types/pokemon'

import { fetchPokemonByName, usePokemonByNameQuery } from '@/hooks/query/usePokemonByNameQuery'
import { useSelectionStore } from '@/stores/selectionStore'

export function useDirectCard(pokemon: PokemonEntry[]) {
  const selectedName = useSelectionStore(s => s.selectedName)
  const fromUrl = useSelectionStore(s => s.fromUrl)

  const selectedInList = selectedName
    ? (pokemon.find(p => p.name === selectedName) ?? null)
    : null

  const needsDirect = selectedName !== null && (fromUrl || selectedInList === null)

  const { pokemon: directPokemon } = usePokemonByNameQuery(needsDirect ? selectedName : null)
  const directData = needsDirect ? (directPokemon ?? selectedInList) : null

  useEffect(() => {
    const selected = directData ?? selectedInList
    document.title = selected
      ? `${selected.name.charAt(0).toUpperCase() + selected.name.slice(1)} | Opendex`
      : 'Opendex'
  }, [directData, selectedInList])

  return { directData, needsDirect }
}
