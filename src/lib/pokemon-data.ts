import type { PokemonEntry } from '@/lib/types'

import pokemonData from '@/data/pokemon.json'

export const pokemonByName = new Map(
  (pokemonData as unknown as PokemonEntry[]).map(p => [p.name, p])
)
