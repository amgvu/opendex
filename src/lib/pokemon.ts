export const colors: Record<string, string> = {
  Bug: 'bg-lime-500',
  Dark: 'bg-slate-800',
  Dragon: 'bg-indigo-700',
  Electric: 'bg-yellow-500',
  Fairy: 'bg-pink-300',
  Fighting: 'bg-red-700',
  Fire: 'bg-red-500',
  Flying: 'bg-indigo-400',
  Ghost: 'bg-purple-700',
  Grass: 'bg-green-500',
  Ground: 'bg-amber-600',
  Ice: 'bg-cyan-300',
  Normal: 'bg-slate-400',
  Poison: 'bg-purple-500',
  Psychic: 'bg-pink-500',
  Rock: 'bg-amber-700',
  Steel: 'bg-slate-500',
  Water: 'bg-blue-500'
}

export const getTypeColor = (type: string) => {
  return colors[type] ?? 'bg-slate-400'
}

export const formatPokedexId = (id: number) =>
  `#${String(id).padStart(4, '0')}`

// Attacking type → defending type → multiplier
// Row = attacking type, Col = defending type
// 0 = immune, 0.5 = not very effective, 2 = super effective
const TYPE_CHART: Record<string, Record<string, number>> = {
  Bug:      { Bug: 1, Dark: 2, Dragon: 1, Electric: 1, Fairy: 0.5, Fighting: 0.5, Fire: 0.5, Flying: 0.5, Ghost: 0.5, Grass: 2, Ground: 1, Ice: 1, Normal: 1, Poison: 0.5, Psychic: 2, Rock: 1, Steel: 0.5, Water: 1 },
  Dark:     { Bug: 1, Dark: 0.5, Dragon: 1, Electric: 1, Fairy: 0.5, Fighting: 0.5, Fire: 1, Flying: 1, Ghost: 2, Grass: 1, Ground: 1, Ice: 1, Normal: 1, Poison: 1, Psychic: 2, Rock: 1, Steel: 0.5, Water: 1 },
  Dragon:   { Bug: 1, Dark: 1, Dragon: 2, Electric: 1, Fairy: 0, Fighting: 1, Fire: 1, Flying: 1, Ghost: 1, Grass: 1, Ground: 1, Ice: 1, Normal: 1, Poison: 1, Psychic: 1, Rock: 1, Steel: 0.5, Water: 1 },
  Electric: { Bug: 1, Dark: 1, Dragon: 0.5, Electric: 0.5, Fairy: 1, Fighting: 1, Fire: 1, Flying: 2, Ghost: 1, Grass: 0.5, Ground: 0, Ice: 1, Normal: 1, Poison: 1, Psychic: 1, Rock: 1, Steel: 1, Water: 2 },
  Fairy:    { Bug: 1, Dark: 2, Dragon: 2, Electric: 1, Fairy: 1, Fighting: 2, Fire: 0.5, Flying: 1, Ghost: 1, Grass: 1, Ground: 1, Ice: 1, Normal: 1, Poison: 0.5, Psychic: 1, Rock: 1, Steel: 0.5, Water: 1 },
  Fighting: { Bug: 0.5, Dark: 2, Dragon: 1, Electric: 1, Fairy: 0.5, Fighting: 1, Fire: 1, Flying: 0.5, Ghost: 0, Grass: 1, Ground: 1, Ice: 2, Normal: 2, Poison: 0.5, Psychic: 0.5, Rock: 2, Steel: 2, Water: 1 },
  Fire:     { Bug: 2, Dark: 1, Dragon: 0.5, Electric: 1, Fairy: 1, Fighting: 1, Fire: 0.5, Flying: 1, Ghost: 1, Grass: 2, Ground: 1, Ice: 2, Normal: 1, Poison: 1, Psychic: 1, Rock: 0.5, Steel: 2, Water: 0.5 },
  Flying:   { Bug: 2, Dark: 1, Dragon: 1, Electric: 0.5, Fairy: 1, Fighting: 2, Fire: 1, Flying: 1, Ghost: 1, Grass: 2, Ground: 1, Ice: 1, Normal: 1, Poison: 1, Psychic: 1, Rock: 0.5, Steel: 0.5, Water: 1 },
  Ghost:    { Bug: 1, Dark: 0.5, Dragon: 1, Electric: 1, Fairy: 1, Fighting: 1, Fire: 1, Flying: 1, Ghost: 2, Grass: 1, Ground: 1, Ice: 1, Normal: 0, Poison: 1, Psychic: 2, Rock: 1, Steel: 1, Water: 1 },
  Grass:    { Bug: 0.5, Dark: 1, Dragon: 0.5, Electric: 1, Fairy: 1, Fighting: 1, Fire: 0.5, Flying: 0.5, Ghost: 1, Grass: 0.5, Ground: 2, Ice: 1, Normal: 1, Poison: 0.5, Psychic: 1, Rock: 2, Steel: 0.5, Water: 2 },
  Ground:   { Bug: 0.5, Dark: 1, Dragon: 1, Electric: 2, Fairy: 1, Fighting: 1, Fire: 2, Flying: 0, Ghost: 1, Grass: 0.5, Ground: 1, Ice: 1, Normal: 1, Poison: 2, Psychic: 1, Rock: 2, Steel: 2, Water: 1 },
  Ice:      { Bug: 1, Dark: 1, Dragon: 2, Electric: 1, Fairy: 1, Fighting: 1, Fire: 0.5, Flying: 2, Ghost: 1, Grass: 2, Ground: 2, Ice: 0.5, Normal: 1, Poison: 1, Psychic: 1, Rock: 1, Steel: 0.5, Water: 0.5 },
  Normal:   { Bug: 1, Dark: 1, Dragon: 1, Electric: 1, Fairy: 1, Fighting: 1, Fire: 1, Flying: 1, Ghost: 0, Grass: 1, Ground: 1, Ice: 1, Normal: 1, Poison: 1, Psychic: 1, Rock: 0.5, Steel: 0.5, Water: 1 },
  Poison:   { Bug: 1, Dark: 1, Dragon: 1, Electric: 1, Fairy: 2, Fighting: 1, Fire: 1, Flying: 1, Ghost: 0.5, Grass: 2, Ground: 0.5, Ice: 1, Normal: 1, Poison: 0.5, Psychic: 1, Rock: 0.5, Steel: 0, Water: 1 },
  Psychic:  { Bug: 1, Dark: 0, Dragon: 1, Electric: 1, Fairy: 1, Fighting: 2, Fire: 1, Flying: 1, Ghost: 1, Grass: 1, Ground: 1, Ice: 1, Normal: 1, Poison: 2, Psychic: 0.5, Rock: 1, Steel: 0.5, Water: 1 },
  Rock:     { Bug: 2, Dark: 1, Dragon: 1, Electric: 1, Fairy: 1, Fighting: 0.5, Fire: 2, Flying: 2, Ghost: 1, Grass: 1, Ground: 0.5, Ice: 2, Normal: 1, Poison: 1, Psychic: 1, Rock: 1, Steel: 0.5, Water: 1 },
  Steel:    { Bug: 1, Dark: 1, Dragon: 1, Electric: 0.5, Fairy: 2, Fighting: 1, Fire: 0.5, Flying: 1, Ghost: 1, Grass: 1, Ground: 1, Ice: 2, Normal: 1, Poison: 1, Psychic: 1, Rock: 2, Steel: 0.5, Water: 0.5 },
  Water:    { Bug: 1, Dark: 1, Dragon: 0.5, Electric: 1, Fairy: 1, Fighting: 1, Fire: 2, Flying: 1, Ghost: 1, Grass: 0.5, Ground: 2, Ice: 1, Normal: 1, Poison: 1, Psychic: 1, Rock: 2, Steel: 1, Water: 0.5 }
}

const ALL_TYPES = Object.keys(TYPE_CHART)

export function getTypeMatchups(types: string[]) {
  const weaknesses: { multiplier: 2 | 4; type: string }[] = []
  const resistances: { multiplier: 0.25 | 0.5; type: string }[] = []
  const immunities: string[] = []

  for (const attacker of ALL_TYPES) {
    const multiplier = types.reduce((acc, defender) => {
      return acc * (TYPE_CHART[attacker]?.[defender] ?? 1)
    }, 1)

    if (multiplier === 0) immunities.push(attacker)
    else if (multiplier === 4) weaknesses.push({ multiplier: 4, type: attacker })
    else if (multiplier === 2) weaknesses.push({ multiplier: 2, type: attacker })
    else if (multiplier === 0.25) resistances.push({ multiplier: 0.25, type: attacker })
    else if (multiplier === 0.5) resistances.push({ multiplier: 0.5, type: attacker })
  }

  return { immunities, resistances, weaknesses }
}
