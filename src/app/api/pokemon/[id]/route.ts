import type { NextRequest } from 'next/server'

import { NextResponse } from 'next/server'

import type { PokemonEntry, PokemonVariant } from '@/types/pokemon'

import pokemonData from '@/data/pokemon.json'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const numId = parseInt(id)
  if (isNaN(numId)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
  }

  const vi = req.nextUrl.searchParams.get('vi')
  const variantIndex = vi !== null ? parseInt(vi) : null

  const pokemon = (pokemonData as unknown as PokemonEntry[]).find(p =>
    p.id === numId &&
    (variantIndex !== null
      ? (p as PokemonVariant).variantIndex === variantIndex
      : !(p as PokemonVariant).variantType)
  )

  if (!pokemon) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  return NextResponse.json(pokemon, {
    headers: { 'Cache-Control': 'public, max-age=3600' }
  })
}
