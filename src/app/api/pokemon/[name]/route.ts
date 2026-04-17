import type { NextRequest } from 'next/server'

import { NextResponse } from 'next/server'

import type { PokemonEntry } from '@/types/pokemon'

import pokemonData from '@/data/pokemon.json'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params
  const pokemon = (pokemonData as unknown as PokemonEntry[]).find(p => p.name === name)
  if (!pokemon) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  return NextResponse.json(pokemon, {
    headers: { 'Cache-Control': 'public, max-age=3600' }
  })
}
