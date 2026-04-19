import type { PokemonEntry } from '@/types/pokemon'

import pokemonData from '@/data/pokemon.json'

const pokemonByName = new Map(
  (pokemonData as PokemonEntry[]).map(p => [p.name.toLowerCase(), p])
)

export function getPokemonByName(name: string): PokemonEntry | null {
  return pokemonByName.get(name.toLowerCase()) || null
}
