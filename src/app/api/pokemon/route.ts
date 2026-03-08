/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/require-await */
import type { NextRequest } from 'next/server'

import { NextResponse } from 'next/server'

import pokemonData from '@/data/pokemon.json'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''
    const sortBy = searchParams.get('sortBy') || 'id'
    const sortOrder = searchParams.get('sortOrder') || 'asc'

    let filteredPokemon = [...pokemonData]

    if (search) {
      filteredPokemon = filteredPokemon.filter(
        pokemon =>
          pokemon.name.toLowerCase().includes(search.toLowerCase()) ||
          pokemon.types.some(type =>
            type.toLowerCase().includes(search.toLowerCase())
          ) ||
          String(pokemon.id) === search
      )
    }

    filteredPokemon.sort((a, b) => {
      const aVal = sortBy === 'type' ? (a.types[0] ?? '') : a[sortBy as keyof typeof a]
      const bVal = sortBy === 'type' ? (b.types[0] ?? '') : b[sortBy as keyof typeof b]
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortOrder === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal)
      }
      return sortOrder === 'asc'
        ? (aVal as number) - (bVal as number)
        : (bVal as number) - (aVal as number)
    })

    // Calculate pagination
    const total = filteredPokemon.length
    const totalPages = Math.ceil(total / limit)
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedPokemon = filteredPokemon.slice(startIndex, endIndex)

    return NextResponse.json({
      data: paginatedPokemon,
      pagination: {
        hasNext: page < totalPages,
        hasPrev: page > 1,
        limit,
        page,
        total,
        totalPages
      }
    })
  } catch (error) {
    console.error('Error fetching Pokemon:', error)
    return NextResponse.json(
      { error: 'Failed to fetch Pokemon' },
      { status: 500 }
    )
  }
}
