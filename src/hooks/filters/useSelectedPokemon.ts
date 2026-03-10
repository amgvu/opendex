import { useSearchParams } from 'next/navigation'
import { useCallback, useState } from 'react'

import { useUrlSync } from './useUrlSync'

export function useSelectedPokemon() {
  const searchParams = useSearchParams()
  const { routerRef, searchParamsRef } = useUrlSync()

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
  }, [routerRef, searchParamsRef])

  return { selectedId, setSelectedId: selectPokemon }
}
