import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

import { useUrlSync } from './useUrlSync'

export function useSearch(delay = 300) {
  const searchParams = useSearchParams()
  const { routerRef, searchParamsRef } = useUrlSync()

  const initialSearch = searchParams.get('search') ?? ''
  const [search, setSearch] = useState(initialSearch)
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
      const params = new URLSearchParams(searchParamsRef.current.toString())
      if (search) {
        params.set('search', search)
      } else {
        params.delete('search')
      }
      routerRef.current.replace(`?${params.toString()}`, { scroll: false })
    }, delay)
    return () => clearTimeout(timer)
  }, [search, delay, routerRef, searchParamsRef])

  return { debouncedSearch, search, setSearch }
}
