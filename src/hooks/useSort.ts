import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useRef, useState } from 'react'

import type { SortField, SortOrder } from '@/types/sort'

export function useSort() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const searchParamsRef = useRef(searchParams)
  const routerRef = useRef(router)

  searchParamsRef.current = searchParams
  routerRef.current = router

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
  }, [sortBy, sortOrder])

  return { sortBy, sortOrder, updateSort }
}
