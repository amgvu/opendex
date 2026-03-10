import { useSearchParams } from 'next/navigation'
import { useCallback, useState } from 'react'

import type { SortField, SortOrder } from '@/types/sort'

import { useUrlSync } from './useUrlSync'

export function useSort() {
  const searchParams = useSearchParams()
  const { routerRef, searchParamsRef } = useUrlSync()

  const [sortBy, setSortBy] = useState<SortField>(
    (searchParams.get('sortBy') as SortField) ?? 'id'
  )
  const [sortOrder, setSortOrder] = useState<SortOrder>(
    (searchParams.get('sortOrder') as SortOrder) ?? 'asc'
  )

  const updateSort = useCallback((field: SortField) => {
    const newOrder: SortOrder =
      sortBy === field && sortOrder === 'asc' ? 'desc' : 'asc'

    setSortBy(field)
    setSortOrder(newOrder)

    const params = new URLSearchParams(searchParamsRef.current.toString())
    if (field === 'id' && newOrder === 'asc') {
      params.delete('sortBy')
      params.delete('sortOrder')
    } else {
      params.set('sortBy', field)
      params.set('sortOrder', newOrder)
    }
    routerRef.current.replace(`?${params.toString()}`, { scroll: false })
  }, [sortBy, sortOrder, routerRef, searchParamsRef])

  return { sortBy, sortOrder, updateSort }
}
