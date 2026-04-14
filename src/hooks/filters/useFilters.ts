import { useSearchParams } from 'next/navigation'
import { useEffect, useRef } from 'react'

import { useFilterStore } from '@/stores/filterStore'

import { useUrlSync } from './useUrlSync'

export function useFilters() {
  const searchParams = useSearchParams()
  const { routerRef, searchParamsRef } = useUrlSync()

  const initialized = useRef(false)
  if (!initialized.current) {
    initialized.current = true
    useFilterStore.getState().setSelectedTypes(
      searchParams.get('types')?.split(',').filter(Boolean) ?? []
    )
    useFilterStore.getState().setSelectedGens(
      searchParams.get('gens')?.split(',').map(Number).filter(Boolean) ?? []
    )
  }

  const selectedGens = useFilterStore(s => s.selectedGens)
  const selectedTypes = useFilterStore(s => s.selectedTypes)

  useEffect(() => {
    const params = new URLSearchParams(searchParamsRef.current.toString())
    if (selectedTypes.length > 0) params.set('types', selectedTypes.join(','))
    else params.delete('types')
    if (selectedGens.length > 0) params.set('gens', selectedGens.join(','))
    else params.delete('gens')
    routerRef.current.replace(`?${params.toString()}`, { scroll: false })
  }, [selectedGens, selectedTypes, routerRef, searchParamsRef])
}
