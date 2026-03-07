'use client'

import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'

import type { Pokemon } from '@/types/pokemon'

import { fetchPokemon, type PokemonResponse } from '@/lib/api'
import { getTypeColor } from '@/lib/pokemon'

import { Input } from './ui/input'

export default function PokemonGrid() {
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(timer)
  }, [search])

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      getNextPageParam: (lastPage: PokemonResponse) =>
        lastPage.pagination.hasNext ? lastPage.pagination.page + 1 : undefined,
      initialPageParam: 1,
      placeholderData: keepPreviousData,
      queryFn: ({ pageParam }: { pageParam: number }) =>
        fetchPokemon(pageParam, debouncedSearch),
      queryKey: ['pokemon', debouncedSearch]
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

  return (
    <div className="mx-auto max-w-7xl p-4">
      <Input
        className="mb-6"
        onChange={e => setSearch(e.target.value)}
        placeholder="Search Pokemon..."
        type="text"
        value={search}
      />

      {status === 'pending' && <p className="text-center">Loading...</p>}
      {status === 'error' && (
        <p className="text-center text-red-500">Failed to load Pokemon.</p>
      )}
      {status === 'success' && pokemon.length === 0 && (
        <p className="text-center text-muted-foreground">No Pokemon found.</p>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {pokemon.map((p: Pokemon) => (
          <div className="rounded-xl border bg-card p-4 shadow-sm" key={p.id}>
            <p className="font-semibold capitalize">{p.name}</p>
            <div className="mt-2 flex flex-wrap gap-1">
              {p.types.map((type: string) => (
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium text-white ${getTypeColor(type)}`}
                  key={type}
                >
                  {type}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="h-8" ref={sentinelRef} />

      {isFetchingNextPage && (
        <p className="py-4 text-center text-muted-foreground">
          Loading more...
        </p>
      )}
    </div>
  )
}
