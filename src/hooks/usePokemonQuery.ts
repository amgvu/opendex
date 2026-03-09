import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query'
import { useCallback } from 'react'

import type { Pokemon } from '@/types/pokemon'

import { fetchPokemon, type PokemonResponse } from '@/lib/api'

export function usePokemonQuery(
  search: string,
  sortBy: string,
  sortOrder: string,
  types: string[] = [],
  gens: number[] = []
) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      gcTime: Infinity,
      getNextPageParam: (lastPage: PokemonResponse) =>
        lastPage.pagination.hasNext ? lastPage.pagination.page + 1 : undefined,
      initialPageParam: 1,
      placeholderData: keepPreviousData,
      queryFn: ({ pageParam }: { pageParam: number }) =>
        fetchPokemon(pageParam, search, sortBy, sortOrder, types, gens),
      queryKey: ['pokemon', search, sortBy, sortOrder, types, gens],
      select: data => data.pages.flatMap((page: PokemonResponse) => page.data),
      staleTime: Infinity
    })

  const pokemon: Pokemon[] = data ?? []
  const loadMore = useCallback(() => { void fetchNextPage() }, [fetchNextPage])

  return { hasNextPage, isFetchingNextPage, loadMore, pokemon, status }
}
