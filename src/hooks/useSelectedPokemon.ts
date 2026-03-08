import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useRef, useState } from 'react'

export function useSelectedPokemon() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const searchParamsRef = useRef(searchParams)
  const routerRef = useRef(router)

  searchParamsRef.current = searchParams
  routerRef.current = router

  const [selectedId, setSelectedId] = useState<null | number>(
    searchParams.get('pokemon') ? Number(searchParams.get('pokemon')) : null
  )

  const selectPokemon = useCallback((id: null | number) => {
    setSelectedId(id)
    const params = new URLSearchParams(searchParamsRef.current.toString())
    if (id !== null) {
      params.set('pokemon', String(id))
    } else {
      params.delete('pokemon')
    }
    routerRef.current.replace(`?${params.toString()}`, { scroll: false })
  }, [])

  return { selectedId, setSelectedId: selectPokemon }
}
