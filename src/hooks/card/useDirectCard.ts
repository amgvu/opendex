import { useEffect } from 'react'

import type { PokemonEntry } from '@/lib/types'

import { usePokemonByNameQuery } from '@/hooks/query/usePokemonByNameQuery'
import { capitalize, SITE_NAME } from '@/lib/pokemon'
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
      ? `${capitalize(selected.name)} — ${SITE_NAME}`
      : SITE_NAME
  }, [directData, selectedInList])

  return { directData, needsDirect }
}
