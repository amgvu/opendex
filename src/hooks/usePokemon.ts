import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'

import type { Pokemon } from '@/types/pokemon'

import { fetchPokemon, type PokemonResponse } from '@/lib/api'

export function usePokemon(search: string) {
  const sentinelRef = useRef<HTMLDivElement>(null)

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      getNextPageParam: (lastPage: PokemonResponse) =>
        lastPage.pagination.hasNext ? lastPage.pagination.page + 1 : undefined,
      initialPageParam: 1,
      placeholderData: keepPreviousData,
      queryFn: ({ pageParam }: { pageParam: number }) =>
        fetchPokemon(pageParam, search),
      queryKey: ['pokemon', search]
    })

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          void fetchNextPage()
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  const pokemon: Pokemon[] =
    data?.pages.flatMap((page: PokemonResponse) => page.data) ?? []

  return { fetchNextPage, hasNextPage, isFetchingNextPage, pokemon, sentinelRef, status }
}
