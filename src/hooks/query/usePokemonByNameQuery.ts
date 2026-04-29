import { useQuery } from '@tanstack/react-query'

import type { PokemonEntry } from '@/lib/types'

export const pokemonByNameQueryKey = (name: string) => ['pokemon-by-name', name]

export async function fetchPokemonByName(name: string): Promise<PokemonEntry> {
  const res = await fetch(`/api/pokemon/${encodeURIComponent(name)}`)
  if (!res.ok) throw new Error('Failed to fetch Pokemon')
  return res.json() as Promise<PokemonEntry>
}

export const pokemonByNameQueryOptions = (name: string) => ({
  gcTime: Infinity,
  queryFn: () => fetchPokemonByName(name),
  queryKey: pokemonByNameQueryKey(name),
  staleTime: Infinity
})

export function usePokemonByNameQuery(name: null | string) {
  const { data } = useQuery({
    enabled: name !== null,
    ...pokemonByNameQueryOptions(name ?? '')
  })

  return { pokemon: data ?? null }
}
