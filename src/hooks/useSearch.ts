import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'

export function useSearch(delay = 300) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const searchParamsRef = useRef(searchParams)
  const routerRef = useRef(router)

  searchParamsRef.current = searchParams
  routerRef.current = router

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
  }, [search, delay])

  const updateSearch = useCallback((value: string) => {
    setSearch(value)
  }, [])

  return { debouncedSearch, search, setSearch: updateSearch }
}
