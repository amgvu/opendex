import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

import { useFilterStore } from '@/stores/filterStore'

import { useUrlSync } from './useUrlSync'

export function useSearch(delay = 300) {
  const searchParams = useSearchParams()
  const { routerRef, searchParamsRef } = useUrlSync()
  const search = useFilterStore(s => s.search)

  useEffect(() => {
    const val = searchParams.get('search') ?? ''
    useFilterStore.getState().setSearch(val)
    useFilterStore.getState().setDebouncedSearch(val)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      useFilterStore.getState().setDebouncedSearch(search)
      const params = new URLSearchParams(searchParamsRef.current.toString())
      if (search) params.set('search', search)
      else params.delete('search')
      routerRef.current.replace(`?${params.toString()}`, { scroll: false })
    }, delay)
    return () => clearTimeout(timer)
  }, [search, delay, routerRef, searchParamsRef])
}
