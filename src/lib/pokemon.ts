export const colors: Record<string, string> = {
  Bug: 'bg-[#A6B91A]',
  Dark: 'bg-[#705746]',
  Dragon: 'bg-[#6F35FC]',
  Electric: 'bg-[#F7D02C]',
  Fairy: 'bg-[#D685AD]',
  Fighting: 'bg-[#C22E28]',
  Fire: 'bg-[#EE8130]',
  Flying: 'bg-[#A98FF3]',
  Ghost: 'bg-[#735797]',
  Grass: 'bg-[#7AC74C]',
  Ground: 'bg-[#E2BF65]',
  Ice: 'bg-[#96D9D6]',
  Normal: 'bg-[#A8A77A]',
  Poison: 'bg-[#A33EA1]',
  Psychic: 'bg-[#F95587]',
  Rock: 'bg-[#B6A136]',
  Steel: 'bg-[#B7B7CE]',
  Water: 'bg-[#6390F0]'
}

export const getTypeColor = (type: string) => colors[type] ?? 'bg-[#A8A77A]'

export const bgClassToVar = (cls: string) =>
  cls.match(/bg-\[([^\]]+)\]/)?.[1] ?? `var(${cls.replace('bg-', '--color-')})`

export const formatPokedexId = (id: number, variantIndex?: null | number) => {
  const base = `#${String(id).padStart(4, '0')}`
  return variantIndex != null ? `${base}-${variantIndex}` : base
}

export const VARIANT_LABELS: Record<string, string> = {
  alolan: 'Alolan',
  galarian: 'Galarian',
  hisuian: 'Hisuian',
  mega: 'Mega',
  'mega-x': 'Mega X',
  'mega-y': 'Mega Y',
  paldean: 'Paldean'
}

export const EV_STAT_LABELS: Record<string, string> = {
  attack: 'Atk',
  defense: 'Def',
  hp: 'HP',
  'special-attack': 'Sp.Atk',
  'special-defense': 'Sp.Def',
  speed: 'Spd'
}

// Attacking type → defending type → multiplier (omitted = 1)
const TYPE_CHART: Record<string, Record<string, number>> = {
  Bug: {
    Dark: 2,
    Fairy: 0.5,
    Fighting: 0.5,
    Fire: 0.5,
    Flying: 0.5,
    Ghost: 0.5,
    Grass: 2,
    Poison: 0.5,
    Psychic: 2,
    Steel: 0.5
  },
  Dark: {
    Dark: 0.5,
    Fairy: 0.5,
    Fighting: 0.5,
    Ghost: 2,
    Psychic: 2,
    Steel: 0.5
  },
  Dragon: { Dragon: 2, Fairy: 0, Steel: 0.5 },
  Electric: {
    Dragon: 0.5,
    Electric: 0.5,
    Flying: 2,
    Grass: 0.5,
    Ground: 0,
    Water: 2
  },
  Fairy: {
    Dark: 2,
    Dragon: 2,
    Fighting: 2,
    Fire: 0.5,
    Poison: 0.5,
    Steel: 0.5
  },
  Fighting: {
    Bug: 0.5,
    Dark: 2,
    Fairy: 0.5,
    Flying: 0.5,
    Ghost: 0,
    Ice: 2,
    Normal: 2,
    Poison: 0.5,
    Psychic: 0.5,
    Rock: 2,
    Steel: 2
  },
  Fire: {
    Bug: 2,
    Dragon: 0.5,
    Fire: 0.5,
    Grass: 2,
    Ice: 2,
    Rock: 0.5,
    Steel: 2,
    Water: 0.5
  },
  Flying: {
    Bug: 2,
    Electric: 0.5,
    Fighting: 2,
    Grass: 2,
    Rock: 0.5,
    Steel: 0.5
  },
  Ghost: { Dark: 0.5, Ghost: 2, Normal: 0, Psychic: 2 },
  Grass: {
    Bug: 0.5,
    Dragon: 0.5,
    Fire: 0.5,
    Flying: 0.5,
    Grass: 0.5,
    Ground: 2,
    Poison: 0.5,
    Rock: 2,
    Steel: 0.5,
    Water: 2
  },
  Ground: {
    Bug: 0.5,
    Electric: 2,
    Fire: 2,
    Flying: 0,
    Grass: 0.5,
    Poison: 2,
    Rock: 2,
    Steel: 2
  },
  Ice: {
    Dragon: 2,
    Fire: 0.5,
    Flying: 2,
    Grass: 2,
    Ground: 2,
    Ice: 0.5,
    Steel: 0.5,
    Water: 0.5
  },
  Normal: { Ghost: 0, Rock: 0.5, Steel: 0.5 },
  Poison: {
    Fairy: 2,
    Ghost: 0.5,
    Grass: 2,
    Ground: 0.5,
    Poison: 0.5,
    Rock: 0.5,
    Steel: 0
  },
  Psychic: { Dark: 0, Fighting: 2, Poison: 2, Psychic: 0.5, Steel: 0.5 },
  Rock: {
    Bug: 2,
    Fighting: 0.5,
    Fire: 2,
    Flying: 2,
    Ground: 0.5,
    Ice: 2,
    Steel: 0.5
  },
  Steel: {
    Electric: 0.5,
    Fairy: 2,
    Fire: 0.5,
    Ice: 2,
    Rock: 2,
    Steel: 0.5,
    Water: 0.5
  },
  Water: { Dragon: 0.5, Fire: 2, Grass: 0.5, Ground: 2, Rock: 2, Water: 0.5 }
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
    else if (multiplier === 4)
      weaknesses.push({ multiplier: 4, type: attacker })
    else if (multiplier === 2)
      weaknesses.push({ multiplier: 2, type: attacker })
    else if (multiplier === 0.25)
      resistances.push({ multiplier: 0.25, type: attacker })
    else if (multiplier === 0.5)
      resistances.push({ multiplier: 0.5, type: attacker })
  }

  return { immunities, resistances, weaknesses }
}
