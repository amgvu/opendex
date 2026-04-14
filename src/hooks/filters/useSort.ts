import { useSearchParams } from 'next/navigation'
import { useEffect, useRef } from 'react'

import type { SortField, SortOrder } from '@/types/sort'

import { useFilterStore } from '@/stores/filterStore'

import { useUrlSync } from './useUrlSync'

export function useSort() {
  const searchParams = useSearchParams()
  const { routerRef, searchParamsRef } = useUrlSync()

  const initialized = useRef(false)
  if (!initialized.current) {
    initialized.current = true
    useFilterStore.getState().setSortBy((searchParams.get('sortBy') as SortField) ?? 'id')
    useFilterStore.getState().setSortOrder((searchParams.get('sortOrder') as SortOrder) ?? 'asc')
  }

  const sortBy = useFilterStore(s => s.sortBy)
  const sortOrder = useFilterStore(s => s.sortOrder)

  useEffect(() => {
    const params = new URLSearchParams(searchParamsRef.current.toString())
    if (sortBy === 'id' && sortOrder === 'asc') {
      params.delete('sortBy')
      params.delete('sortOrder')
    } else {
      params.set('sortBy', sortBy)
      params.set('sortOrder', sortOrder)
    }
    routerRef.current.replace(`?${params.toString()}`, { scroll: false })
  }, [sortBy, sortOrder, routerRef, searchParamsRef])
}
