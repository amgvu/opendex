'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

import { useSelectionStore } from '@/stores/selectionStore'

export function useSelectedPokemon() {
  const searchParams = useSearchParams()
  const { selectedId, setSelectedId, setSelectedIdFromUrl } = useSelectionStore()

  useEffect(() => {
    const raw = parseInt(searchParams.get('pokemon') ?? '', 10)
    if (!isNaN(raw)) setSelectedIdFromUrl(raw)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { selectedId, setSelectedId }
}
