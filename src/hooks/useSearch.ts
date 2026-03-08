import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export function useSearch(delay = 300) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialSearch = searchParams.get('search') ?? ''

  const [search, setSearch] = useState(initialSearch)
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
      const params = new URLSearchParams(searchParams.toString())
      if (search) {
        params.set('search', search)
      } else {
        params.delete('search')
      }
      router.replace(`?${params.toString()}`, { scroll: false })
    }, delay)
    return () => clearTimeout(timer)
  }, [search, delay, router, searchParams])

  return { debouncedSearch, search, setSearch }
}
