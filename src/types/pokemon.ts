export type EvolutionStep = {
  fromId: number
  fromName: string
  toId: number
  toName: string
  trigger: string
}

export type Pokemon = {
  abilities?: { description?: string; isHidden: boolean; name: string }[]
  attack: number
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
  hp: number
  id: number
  imageUrl: string
  isLegendary?: boolean
  name: string
  officialUrl: string
  specialAttack: number
  specialDefense: number
  speed: number
  types: string[]
  weight: number
}
