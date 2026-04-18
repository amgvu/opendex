import { useSearchParams } from 'next/navigation'
import { useEffect, useRef } from 'react'

import { useSelectionStore } from '@/stores/selectionStore'

import { useUrlSync } from './useUrlSync'

export function useSelectedPokemon() {
  const searchParams = useSearchParams()
  const { routerRef, searchParamsRef } = useUrlSync()
  const setSelectedNameFromUrl = useSelectionStore(s => s.setSelectedNameFromUrl)

  const initialized = useRef(false)
  if (!initialized.current) {
    initialized.current = true
    const name = searchParams.get('pokemon')
    if (name) setSelectedNameFromUrl(name)
  }

  const selectedName = useSelectionStore(s => s.selectedName)

  useEffect(() => {
    const params = new URLSearchParams(searchParamsRef.current.toString())
    if (selectedName) {
      params.set('pokemon', selectedName)
    } else {
      params.delete('pokemon')
    }
    routerRef.current.replace(`?${params.toString()}`, { scroll: false })
  }, [selectedName, routerRef, searchParamsRef])
}
