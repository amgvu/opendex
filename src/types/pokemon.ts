export type Pokemon = {
  abilities?: { isHidden: boolean; name: string }[]
  attack: number
  blurDataURL?: string
  defense: number
  description: string
  evYield?: { stat: string; value: number }[]
  generation: number
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
