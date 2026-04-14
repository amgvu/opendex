import { useQuery } from '@tanstack/react-query'

import type { Pokemon } from '@/types/pokemon'

export const pokemonByIdQueryKey = (id: number) => ['pokemon-by-id', id]

export async function fetchPokemonById(id: number): Promise<Pokemon> {
  const res = await fetch(`/api/pokemon/${id}`)
  if (!res.ok) throw new Error('Failed to fetch Pokemon')
  return res.json() as Promise<Pokemon>
}

export function usePokemonByIdQuery(id: null | number) {
  const { data } = useQuery({
    enabled: id !== null,
    gcTime: Infinity,
    queryFn: () => fetchPokemonById(id!),
    queryKey: pokemonByIdQueryKey(id!),
    staleTime: Infinity
  })

  return { pokemon: data ?? null }
}
