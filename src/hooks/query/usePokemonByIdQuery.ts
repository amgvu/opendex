import { useQuery } from '@tanstack/react-query'

import type { Pokemon } from '@/types/pokemon'

export function usePokemonByIdQuery(id: null | number) {
  const { data } = useQuery({
    enabled: id !== null,
    gcTime: Infinity,
    queryFn: () => fetchPokemonById(id!),
    queryKey: ['pokemon-by-id', id],
    staleTime: Infinity
  })

  return { pokemon: data ?? null }
}

async function fetchPokemonById(id: number): Promise<Pokemon> {
  const res = await fetch(`/api/pokemon/${id}`)
  if (!res.ok) throw new Error('Failed to fetch Pokemon')
  return res.json() as Promise<Pokemon>
}
