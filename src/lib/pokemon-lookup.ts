import type { Pokemon } from '@/types/pokemon'
import type { CollectionItem } from '@/types/collection'
import pokemonData from '@/data/pokemon.json'

const pokemonById = new Map<number, Pokemon>(
  (pokemonData as Pokemon[]).map(p => [p.id, p])
)

export function collectionItemToPokemon(item: CollectionItem): Pokemon {
  const staticData = pokemonById.get(item.pokemonId)
  return {
    id: item.pokemonId,
    name: item.pokemonName,
    types: item.pokemonTypes,
    hp: item.stats.hp,
    attack: item.stats.attack,
    defense: item.stats.defense,
    speed: item.stats.speed,
    specialAttack: item.stats.specialAttack,
    specialDefense: item.stats.specialDefense,
    imageUrl: item.imageUrl,
    officialUrl: item.officialUrl,
    blurDataURL: staticData?.blurDataURL,
    description: staticData?.description ?? '',
    generation: staticData?.generation ?? 1,
    height: staticData?.height ?? 0,
    weight: staticData?.weight ?? 0,
    isLegendary: staticData?.isLegendary,
  }
}

export function getPokemonById(id: number): Pokemon | undefined {
  return pokemonById.get(id)
}

export function xpProgress(experience: number, level: number): number {
  if (level >= 10) return 1
  const start = Math.pow(level - 1, 2) * 50
  const next  = Math.pow(level, 2) * 50
  return Math.min(1, (experience - start) / (next - start))
}
