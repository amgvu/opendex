export type EvolutionStep = {
  fromId: number
  fromName: string
  toId: number
  toName: string
  trigger: string
}

export type MoveDetail = {
  accuracy: null | number
  category: string
  name: string
  power: null | number
  pp: number
  type: string
}

export type LearnsetMove = MoveDetail & { level: number }

export type TypeMatchups = {
  immunities: string[]
  resistances: { multiplier: number; type: string }[]
  weaknesses: { multiplier: number; type: string }[]
}

export type VariantType =
  | 'alolan'
  | 'galarian'
  | 'hisuian'
  | 'mega'
  | 'mega-x'
  | 'mega-y'
  | 'paldean'

export type PokemonVariant = Pokemon & {
  variantIndex: number
  variantOf: number
  variantSlug: string
  variantType: VariantType
}

export type PokemonEntry = Pokemon | PokemonVariant

export type Pokemon = {
  abilities?: { description?: string; isHidden: boolean; name: string }[]
  attack: number
  baseExperience?: number
  baseFriendship?: number
  blurDataURL?: string
  catchRate?: number
  color?: string
  defense: number
  description: string
  eggCycles?: number
  eggGroups?: string[]
  evolutionChain?: EvolutionStep[]
  evYield?: { stat: string; value: number }[]
  flavorTexts?: { game: string; text: string }[]
  genderRate?: number
  generation: number
  genus?: string
  growthRate?: string
  habitat?: null | string
  height: number
  heldItems?: { name: string; rarity: number }[]
  hp: number
  id: number
  imageUrl: string
  isLegendary?: boolean
  isMythical?: boolean
  learnset?: { egg: MoveDetail[]; levelUp: LearnsetMove[]; machine: MoveDetail[] }
  name: string
  officialUrl: string
  specialAttack: number
  specialDefense: number
  speed: number
  typeMatchups?: TypeMatchups
  types: string[]
  weight: number
}
