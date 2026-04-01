import type { Pokemon } from '@/types/pokemon'
import type { CollectionItem, CollectionListResponse } from '@/types/collection'
import type { Battle, BattleHistoryResponse, StartBattleResponse } from '@/types/battle'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'

// ---------------------------------------------------------------------------
// Collection
// ---------------------------------------------------------------------------

export async function fetchCollection(): Promise<CollectionListResponse> {
  const res = await fetch(`${API_URL}/collection`)
  if (!res.ok) throw new Error('Failed to fetch collection')
  return res.json()
}

export async function addToCollection(pokemon: Pokemon): Promise<CollectionItem> {
  const res = await fetch(`${API_URL}/collection`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: pokemon.id,
      name: pokemon.name,
      types: pokemon.types,
      hp: pokemon.hp,
      attack: pokemon.attack,
      defense: pokemon.defense,
      speed: pokemon.speed,
      specialAttack: pokemon.specialAttack,
      specialDefense: pokemon.specialDefense,
      imageUrl: pokemon.imageUrl,
      officialUrl: pokemon.officialUrl,
    }),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.message ?? 'Failed to add to collection')
  }
  return res.json()
}

export async function removeFromCollection(pokemonId: number): Promise<void> {
  const res = await fetch(`${API_URL}/collection/${pokemonId}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Failed to remove from collection')
}

// ---------------------------------------------------------------------------
// Battles
// ---------------------------------------------------------------------------

export async function startBattle(pokemon1Id: number, pokemon2Id: number): Promise<StartBattleResponse> {
  const res = await fetch(`${API_URL}/battles`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pokemon1Id, pokemon2Id }),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.message ?? 'Failed to start battle')
  }
  return res.json()
}

export async function fetchBattle(battleId: string): Promise<Battle> {
  const res = await fetch(`${API_URL}/battles/${battleId}`)
  if (!res.ok) throw new Error('Failed to fetch battle')
  return res.json()
}

export async function fetchBattleHistory(page = 1, pageSize = 20): Promise<BattleHistoryResponse> {
  const res = await fetch(`${API_URL}/battles?page=${page}&pageSize=${pageSize}`)
  if (!res.ok) throw new Error('Failed to fetch battle history')
  return res.json()
}

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
  sortOrder: string = 'asc',
  types: string[] = [],
  gens: number[] = []
): Promise<PokemonResponse> {
  const params = new URLSearchParams({
    limit: '20',
    page: String(page),
    sortBy,
    sortOrder
  })

  if (search) params.set('search', search)
  if (types.length > 0) params.set('types', types.join(','))
  if (gens.length > 0) params.set('gens', gens.join(','))

  const res = await fetch(`/api/pokemon?${params}`)

  if (!res.ok) {
    throw new Error('Failed to fetch Pokemon')
  }

  return res.json() as Promise<PokemonResponse>
}
