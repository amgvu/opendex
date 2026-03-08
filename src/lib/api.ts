import type { Pokemon } from '@/types/pokemon'

export type PokemonResponse = {
  data: Pokemon[]
  pagination: {
    hasNext: boolean
    hasPrev: boolean
    limit: number
    page: number
    total: number
    totalPages: number
  }
}

export async function fetchPokemon(
  page: number,
  search: string = '',
  sortBy: string = 'id',
  sortOrder: string = 'asc'
): Promise<PokemonResponse> {
  const params = new URLSearchParams({
    limit: '20',
    page: String(page),
    sortBy,
    sortOrder
  })

  if (search) {
    params.set('search', search)
  }

  const res = await fetch(`/api/pokemon?${params}`)

  if (!res.ok) {
    throw new Error('Failed to fetch Pokemon')
  }

  return res.json() as Promise<PokemonResponse>
}
