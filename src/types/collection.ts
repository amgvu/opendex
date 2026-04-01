export type CollectionItem = {
  pokemonId: number
  pokemonName: string
  pokemonTypes: string[]
  stats: {
    hp: number
    attack: number
    defense: number
    speed: number
    specialAttack: number
    specialDefense: number
  }
  imageUrl: string
  officialUrl: string
  addedAt: string
  // Vitality
  experience: number
  level: number
  rating: number
  timesBattled: number
  timesWon: number
  winStreak: number
  lossStreak: number
}

export type CollectionListResponse = {
  items: CollectionItem[]
}
