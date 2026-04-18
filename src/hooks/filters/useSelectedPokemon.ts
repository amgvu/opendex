import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

import { useSelectionStore } from '@/stores/selectionStore'

export function useSelectedPokemon() {
  const searchParams = useSearchParams()
  const setSelectedNameFromUrl = useSelectionStore(s => s.setSelectedNameFromUrl)

  useEffect(() => {
    const name = searchParams.get('pokemon')
    if (name) setSelectedNameFromUrl(name)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
