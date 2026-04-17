import { useQuery } from '@tanstack/react-query'

import type { PokemonEntry } from '@/types/pokemon'

export const pokemonByIdQueryKey = (id: number, variantIndex?: null | number) =>
  variantIndex != null ? ['pokemon-by-id', id, variantIndex] : ['pokemon-by-id', id]

export async function fetchPokemonById(
  id: number,
  variantIndex?: null | number
): Promise<PokemonEntry> {
  const url =
    variantIndex != null
      ? `/api/pokemon/${id}?vi=${variantIndex}`
      : `/api/pokemon/${id}`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to fetch Pokemon')
  return res.json() as Promise<PokemonEntry>
}

export function usePokemonByIdQuery(
  id: null | number,
  variantIndex?: null | number
) {
  const { data } = useQuery({
    enabled: id !== null,
    gcTime: Infinity,
    queryFn: () => fetchPokemonById(id!, variantIndex),
    queryKey: pokemonByIdQueryKey(id!, variantIndex),
    staleTime: Infinity
  })

  return { pokemon: data ?? null }
}
