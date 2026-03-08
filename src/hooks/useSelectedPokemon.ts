import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export function useSelectedPokemon() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [selectedId, setSelectedId] = useState<null | number>(
    searchParams.get('pokemon') ? Number(searchParams.get('pokemon')) : null
  )

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    if (selectedId !== null) {
      params.set('pokemon', String(selectedId))
    } else {
      params.delete('pokemon')
    }
    router.replace(`?${params.toString()}`, { scroll: false })
  }, [selectedId]) // eslint-disable-line react-hooks/exhaustive-deps

  return { selectedId, setSelectedId }
}
