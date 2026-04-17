export type TypeMatchups = {
  immunities: string[]
  resistances: { multiplier: number; type: string }[]
  weaknesses: { multiplier: number; type: string }[]
}

export type Move = {
  accuracy: number | null
  category: string
  name: string
  power: number | null
  pp: number | null
  type: string
}

export type LevelUpMove = Move & { level: number }

export type Learnset = {
  egg: Move[]
  levelUp: LevelUpMove[]
  machine: Move[]
}

export type Ability = {
  description: string
  isHidden: boolean
  name: string
}

export type EvolutionStep = {
  fromId: number
  fromName: string
  toId: number
  toName: string
  trigger: string
}

export type GigantamaxData = {
  gmaxMoves: Move[]
  imageUrl: string | null
  officialUrl: string | null
}

export type SpriteSet = {
  imageUrl: string
  officialUrl: string | null
}

export type FemaleSprites = {
  imageUrl: string
  officialUrl: string | null
}

export type VariantType =
  | 'alolan'
  | 'galarian'
  | 'hisuian'
  | 'mega'
  | 'mega-x'
  | 'mega-y'
  | 'paldean'

// Fields present on every entry (base and variant)
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
  evYield: { stat: string; value: number }[]
  evolutionChain: EvolutionStep[]
  flavorTexts: { game: string; text: string }[]
  genderRate: number
  generation: number
  genus?: string
  growthRate?: string
  habitat: string | null
  height: number
  heldItems: { name: string; rarity: number }[]
  hp: number
  id: number
  imageUrl: string
  isLegendary: boolean
  isMythical: boolean
  learnset: Learnset
  name: string
  officialUrl: string | null
  shiny: SpriteSet
  specialAttack: number
  specialDefense: number
  speed: number
  typeMatchups: TypeMatchups
  types: string[]
  weight: number
}

// A standard (base) Pokemon entry
export type Pokemon = PokemonBase & {
  female: FemaleSprites | null
  gigantamax: GigantamaxData | null
  variantType?: never
}

// A variant entry (Mega, Regional form) — separate entry in the dataset
export type PokemonVariant = PokemonBase & {
  female: null
  gigantamax: null
  variantIndex: number
  variantOf: number
  variantSlug: string
  variantType: VariantType
}

export type PokemonEntry = Pokemon | PokemonVariant
