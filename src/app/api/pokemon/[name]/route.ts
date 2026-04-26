import type { NextRequest } from 'next/server'

import { NextResponse } from 'next/server'

import { getPokemonByName } from '@/lib/pokemon-data'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params
  const pokemon = getPokemonByName().get(name)
  if (!pokemon) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  return NextResponse.json(pokemon, {
    headers: { 'Cache-Control': 'public, max-age=3600' }
  })
}
