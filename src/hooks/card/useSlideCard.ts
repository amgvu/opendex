'use client'

import { useEffect } from 'react'

import type { PokemonEntry, PokemonListEntry } from '@/lib/types'

import { usePokemonByNameQuery } from '@/hooks/query/usePokemonByNameQuery'
import { capitalize, SITE_NAME } from '@/lib/pokemon'
import { useSelectionStore } from '@/stores/selectionStore'

export function useSlideCard(pokemon: PokemonListEntry[]) {
  const selectedName = useSelectionStore(s => s.selectedName)
  const mode = useSelectionStore(s => s.mode)

  const selectedInList = selectedName
    ? (pokemon.find(p => p.name === selectedName) ?? null)
    : null

  const needsSlide = mode === 'slide' && selectedName !== null

  const { pokemon: fetchedEntry } = usePokemonByNameQuery(needsSlide ? selectedName : null)

  const slideData: PokemonListEntry | null = needsSlide
    ? ((selectedInList ?? (fetchedEntry as unknown as PokemonListEntry)) ?? null)
    : null

  const slideDetail: PokemonEntry | undefined = fetchedEntry ?? undefined

  useEffect(() => {
    const entry = selectedInList ?? fetchedEntry
    document.title = entry ? `${capitalize(entry.name)} — ${SITE_NAME}` : SITE_NAME
  }, [fetchedEntry, selectedInList])

  return { needsSlide, slideData, slideDetail }
}
