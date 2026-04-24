export type EvolutionStep = {
  fromId: number
  fromName: string
  toId: number
  toName: string
  trigger: string
}

export type LearnsetMove = MoveDetail & { level: number }

export type MoveDetail = {
  accuracy: null | number
  category: string
  effect: string
  name: string
  power: null | number
  pp: number
  shortEffect: string
  type: string
}

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
  heightFt: string
  heightM: number
  heldItems?: { name: string; rarity: number }[]
  hp: number
  id: number
  imageUrl: string
  isBaby?: boolean
  isLegendary?: boolean
  isMythical?: boolean
  learnset?: { egg: MoveDetail[]; levelUp: LearnsetMove[]; machine: MoveDetail[] }
  name: string
  officialUrl: string
  shape?: null | string
  shiny?: { imageUrl: string; officialUrl: null | string }
  specialAttack: number
  specialDefense: number
  speed: number
  typeMatchups?: TypeMatchups
  types: string[]
  weightKg: number
  weightLbs: number
}

export type PokemonEntry = Pokemon | PokemonVariant

export type PokemonVariant = Pokemon & {
  variantIndex: number
  variantOf: number
  variantSlug: string
  variantType: VariantType
}

export type TypeMatchups = {
  immunities: string[]
  resistances: { multiplier: number; type: string }[]
  weaknesses: { multiplier: number; type: string }[]
}

export type VariantType =
  | 'alolan'
  | 'form'
  | 'galarian'
  | 'hisuian'
  | 'mega'
  | 'mega-x'
  | 'mega-y'
  | 'paldean'
