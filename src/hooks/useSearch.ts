import { useEffect, useState } from 'react'

export function useSearch(delay = 300) {
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), delay)
    return () => clearTimeout(timer)
  }, [search, delay])

  return { debouncedSearch, search, setSearch }
}
