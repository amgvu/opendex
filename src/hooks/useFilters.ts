import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useRef, useState } from 'react'

export function useFilters() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const searchParamsRef = useRef(searchParams)
  const routerRef = useRef(router)

  searchParamsRef.current = searchParams
  routerRef.current = router

  const [selectedTypes, setSelectedTypes] = useState<string[]>(
    searchParams.get('types')?.split(',').filter(Boolean) ?? []
  )
  const [selectedGens, setSelectedGens] = useState<number[]>(
    searchParams.get('gens')?.split(',').map(Number).filter(Boolean) ?? []
  )

  const syncUrl = useCallback((types: string[], gens: number[]) => {
    const params = new URLSearchParams(searchParamsRef.current.toString())
    if (types.length > 0) {
      params.set('types', types.join(','))
    } else {
      params.delete('types')
    }
    if (gens.length > 0) {
      params.set('gens', gens.join(','))
    } else {
      params.delete('gens')
    }
    routerRef.current.replace(`?${params.toString()}`, { scroll: false })
  }, [])

  const toggleType = useCallback((type: string) => {
    const next = selectedTypes.includes(type)
      ? selectedTypes.filter(t => t !== type)
      : [...selectedTypes, type]
    setSelectedTypes(next)
    syncUrl(next, selectedGens)
  }, [selectedTypes, selectedGens, syncUrl])

  const toggleGen = useCallback((gen: number) => {
    const next = selectedGens.includes(gen)
      ? selectedGens.filter(g => g !== gen)
      : [...selectedGens, gen]
    setSelectedGens(next)
    syncUrl(selectedTypes, next)
  }, [selectedTypes, selectedGens, syncUrl])

  return { selectedGens, selectedTypes, toggleGen, toggleType }
}
