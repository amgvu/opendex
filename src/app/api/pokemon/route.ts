import type { NextRequest } from 'next/server'

import { NextResponse } from 'next/server'

import pokemonData from '@/data/pokemon.json'

export function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') ?? '1')
    const limit = parseInt(searchParams.get('limit') ?? '20')
    const search = searchParams.get('search') ?? ''
    const sortBy = searchParams.get('sortBy') ?? 'id'
    const sortOrder = searchParams.get('sortOrder') ?? 'asc'
    const types = searchParams.get('types')?.split(',').filter(Boolean) ?? []
    const gens =
      searchParams.get('gens')?.split(',').map(Number).filter(Boolean) ?? []

    const filteredPokemon = getFilteredSorted(
      search,
      sortBy,
      sortOrder,
      types,
      gens
    )

    // Calculate pagination
    const total = filteredPokemon.length
    const totalPages = Math.ceil(total / limit)
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedPokemon = filteredPokemon.slice(startIndex, endIndex)

    return NextResponse.json(
      {
        data: paginatedPokemon,
        pagination: {
          hasNext: page < totalPages,
          hasPrev: page > 1,
          limit,
          page,
          total,
          totalPages
        }
      },
      {
        headers: {
          'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400'
        }
      }
    )
  } catch (error) {
    console.error('Error fetching Pokemon:', error)
    return NextResponse.json(
      { error: 'Failed to fetch Pokemon' },
      { status: 500 }
    )
  }
}

function getFilteredSorted(
  search: string,
  sortBy: string,
  sortOrder: string,
  types: string[],
  gens: number[]
) {
  const term = search.toLowerCase()
  let result = search
    ? pokemonData.filter(
        p =>
          p.name.toLowerCase().includes(term) ||
          p.types.some(t => t.toLowerCase().includes(term)) ||
          p.description.toLowerCase().includes(term) ||
          String(p.id) === search
      )
    : [...pokemonData]

  if (types.length > 0) {
    result = result.filter(p => types.every(t => p.types.includes(t)))
  }
  if (gens.length > 0) {
    result = result.filter(p => gens.includes(p.generation))
  }

  const bst = (p: typeof result[0]) =>
    p.hp + p.attack + p.defense + p.specialAttack + p.specialDefense + p.speed

  result.sort((a, b) => {
    if (sortBy === 'bst') {
      return sortOrder === 'asc' ? bst(a) - bst(b) : bst(b) - bst(a)
    }
    const aVal = a[sortBy as keyof typeof a]
    const bVal = b[sortBy as keyof typeof b]
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sortOrder === 'asc'
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal)
    }
    return sortOrder === 'asc'
      ? (aVal as number) - (bVal as number)
      : (bVal as number) - (aVal as number)
  })

  return result
}
