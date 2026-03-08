import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query'

import type { Pokemon } from '@/types/pokemon'

import { fetchPokemon, type PokemonResponse } from '@/lib/api'

export function usePokemon(search: string, sortBy: string, sortOrder: string) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      gcTime: Infinity,
      getNextPageParam: (lastPage: PokemonResponse) =>
        lastPage.pagination.hasNext ? lastPage.pagination.page + 1 : undefined,
      initialPageParam: 1,
      placeholderData: keepPreviousData,
      queryFn: ({ pageParam }: { pageParam: number }) =>
        fetchPokemon(pageParam, search, sortBy, sortOrder),
      queryKey: ['pokemon', search, sortBy, sortOrder],
      staleTime: Infinity
    })

  const pokemon: Pokemon[] =
    data?.pages.flatMap((page: PokemonResponse) => page.data) ?? []

  return { fetchNextPage, hasNextPage, isFetchingNextPage, pokemon, status }
}
