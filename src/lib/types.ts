export type Ability = {
  description: string
  isHidden: boolean
  longEffect: string
  name: string
}

export type EvolutionStep = {
  fromId: number
  fromName: string
  toId: number
  toName: string
  trigger: string
}

export type FemaleSprites = {
  imageUrl: string
  officialUrl: null | string
}

export type GigantamaxData = {
  gmaxMoves: Move[]
  imageUrl: null | string
  officialUrl: null | string
}

export type Learnset = {
  egg: Move[]
  levelUp: LevelUpMove[]
  machine: Move[]
}

export type LevelUpMove = Move & { level: number }

export type Move = {
  accuracy: null | number
  category: string
  effect: string
  name: string
  power: null | number
  pp: null | number
  shortEffect: string
  type: string
}

export type Pokemon = PokemonBase & {
  female: FemaleSprites | null
  gigantamax: GigantamaxData | null
  variantType?: never
}

export type PokemonEntry = Pokemon | PokemonVariant

export type PokemonVariant = PokemonBase & {
  female: null
  gigantamax: null
  variantIndex: number
  variantOf: number
  variantSlug: string
  variantType: VariantType
}

export type SpriteSet = {
  imageUrl: string
  officialUrl: null | string
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

type PokemonBase = {
  abilities: Ability[]
  attack: number
  baseExperience?: number
  baseFriendship?: number
  catchRate: number
  color?: string
  defense: number
  description: string
  eggCycles?: number
  eggGroups?: string[]
  encounterLocations: { location: string; versions: string[] }[]
  evolutionChain: EvolutionStep[]
  evYield: { stat: string; value: number }[]
  flavorTexts: { game: string; text: string }[]
  genderRate: number
  generation: number
  genus?: string
  growthRate?: string
  habitat: null | string
  heightFt: string
  heightM: number
  heldItems: { name: string; rarity: number }[]
  hp: number
  id: number
  imageUrl: string
  isBaby: boolean
  isLegendary: boolean
  isMythical: boolean
  learnset: Learnset
  name: string
  officialUrl: null | string
  shape: null | string
  shiny: SpriteSet
  specialAttack: number
  specialDefense: number
  speed: number
  typeMatchups: TypeMatchups
  types: string[]
  weightKg: number
  weightLbs: number
}
