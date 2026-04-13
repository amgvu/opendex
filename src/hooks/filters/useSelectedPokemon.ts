import { useSearchParams } from 'next/navigation'
import { useCallback, useState } from 'react'

export function useSelectedPokemon() {
  const searchParams = useSearchParams()

  const [selectedId, setSelectedId] = useState<null | number>(() => {
    const raw = parseInt(searchParams.get('pokemon') ?? '', 10)
    return isNaN(raw) ? null : raw
  })

  const selectPokemon = useCallback((id: null | number) => {
    setSelectedId(id)
    const params = new URLSearchParams(window.location.search)
    if (id !== null) {
      params.set('pokemon', String(id))
    } else {
      params.delete('pokemon')
    }
    history.replaceState(null, '', `?${params.toString()}`)
  }, [])

  return { selectedId, setSelectedId: selectPokemon }
}
