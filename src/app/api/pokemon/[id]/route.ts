import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import pokemonData from '@/data/pokemon.json'

import type { Pokemon } from '@/types/pokemon'

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const numId = parseInt(id)
  if (isNaN(numId)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
  }
  const pokemon = (pokemonData as Pokemon[]).find(p => p.id === numId)
  if (!pokemon) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  return NextResponse.json(pokemon, {
    headers: { 'Cache-Control': 'public, max-age=3600' }
  })
}
