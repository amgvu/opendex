import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { addToCollection, fetchCollection, removeFromCollection } from '@/lib/api'
import type { Pokemon } from '@/types/pokemon'

const COLLECTION_KEY = ['collection']

export function useCollection() {
  const queryClient = useQueryClient()

  const { data, status } = useQuery({
    queryKey: COLLECTION_KEY,
    queryFn: fetchCollection,
    staleTime: 30_000,
  })

  const collectionIds = new Set((data?.items ?? []).map(i => i.pokemonId))

  const add = useMutation({
    mutationFn: (pokemon: Pokemon) => addToCollection(pokemon),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: COLLECTION_KEY }),
  })

  const remove = useMutation({
    mutationFn: (pokemonId: number) => removeFromCollection(pokemonId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: COLLECTION_KEY }),
  })

  return {
    collection: data?.items ?? [],
    collectionIds,
    isInCollection: (pokemonId: number) => collectionIds.has(pokemonId),
    status,
    add,
    remove,
  }
}
