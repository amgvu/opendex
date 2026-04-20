const data = require('../src/data/pokemon.json')

// ─── Helpers ──────────────────────────────────────────────────────────────────

const base = data.filter(p => !p.variantType)
const variants = data.filter(p => p.variantType)
const megas = variants.filter(p => ['mega', 'mega-x', 'mega-y'].includes(p.variantType))
const regionals = variants.filter(p =>
  ['alolan', 'galarian', 'hisuian', 'paldean'].includes(p.variantType)
)

function getBase(id) {
  return data.find(p => p.id === id && !p.variantType)
}

function getVariant(id, variantType) {
  return data.find(p => p.id === id && p.variantType === variantType)
}

function getVariantBySlug(slug) {
  return data.find(p => p.variantSlug === slug)
}

// ─── Dataset shape ────────────────────────────────────────────────────────────

describe('dataset shape', () => {
  test('has at least 1025 base entries', () => {
    expect(base.length).toBeGreaterThanOrEqual(1025)
  })

  test('has variant entries', () => {
    expect(variants.length).toBeGreaterThan(0)
  })

  test('base entries cover IDs 1–1025 with no gaps', () => {
    const ids = new Set(base.map(p => p.id))
    for (let i = 1; i <= 1025; i++) {
      expect(ids.has(i)).toBe(true)
    }
  })

  test('no duplicate base entries', () => {
    const ids = base.map(p => p.id)
    expect(ids.length).toBe(new Set(ids).size)
  })
})

// ─── Required fields on every entry ──────────────────────────────────────────

describe('required fields — all entries', () => {
  const STAT_FIELDS = ['hp', 'attack', 'defense', 'specialAttack', 'specialDefense', 'speed']
  const REQUIRED = [
    'id', 'name', 'types', 'abilities', 'typeMatchups',
    'imageUrl', 'officialUrl', 'shiny', 'learnset', 'evolutionChain',
    ...STAT_FIELDS
  ]

  test.each(REQUIRED)('every entry has field: %s', field => {
    const missing = data.filter(p => p[field] === undefined)
    expect(missing.map(p => p.variantSlug ?? p.name)).toEqual([])
  })

  test('every entry has at least one type', () => {
    const bad = data.filter(p => !p.types || p.types.length === 0)
    expect(bad.map(p => p.variantSlug ?? p.name)).toEqual([])
  })

  test('every entry has typeMatchups with weaknesses/resistances/immunities arrays', () => {
    const bad = data.filter(
      p =>
        !Array.isArray(p.typeMatchups?.weaknesses) ||
        !Array.isArray(p.typeMatchups?.resistances) ||
        !Array.isArray(p.typeMatchups?.immunities)
    )
    expect(bad.map(p => p.variantSlug ?? p.name)).toEqual([])
  })

  test('every entry has shiny.imageUrl and shiny.officialUrl keys', () => {
    const bad = data.filter(
      p => !('imageUrl' in (p.shiny ?? {})) || !('officialUrl' in (p.shiny ?? {}))
    )
    expect(bad.map(p => p.variantSlug ?? p.name)).toEqual([])
  })

  test('every entry has learnset with levelUp/egg/machine arrays', () => {
    const bad = data.filter(
      p =>
        !Array.isArray(p.learnset?.levelUp) ||
        !Array.isArray(p.learnset?.egg) ||
        !Array.isArray(p.learnset?.machine)
    )
    expect(bad.map(p => p.variantSlug ?? p.name)).toEqual([])
  })
})

// ─── Required fields on base entries only ─────────────────────────────────────

describe('required fields — base entries only', () => {
  test('every base entry has gigantamax field (null or object)', () => {
    const bad = base.filter(p => !('gigantamax' in p))
    expect(bad.map(p => p.name)).toEqual([])
  })

  test('every base entry has female field (null or object)', () => {
    const bad = base.filter(p => !('female' in p))
    expect(bad.map(p => p.name)).toEqual([])
  })

  test('base entries have bio fields', () => {
    const BIO_FIELDS = ['generation', 'genus', 'description', 'flavorTexts', 'genderRate']
    for (const field of BIO_FIELDS) {
      const bad = base.filter(p => p[field] === undefined)
      expect({ field, missing: bad.map(p => p.name) }).toEqual({
        field,
        missing: []
      })
    }
  })
})

// ─── Variant identification fields ────────────────────────────────────────────

describe('variant identification fields', () => {
  test('every variant has variantIndex, variantOf, variantSlug, variantType', () => {
    const FIELDS = ['variantIndex', 'variantOf', 'variantSlug', 'variantType']
    for (const field of FIELDS) {
      const bad = variants.filter(p => p[field] === undefined || p[field] === null)
      expect({ field, missing: bad.map(p => p.variantSlug) }).toEqual({
        field,
        missing: []
      })
    }
  })

  test('every variant.variantOf points to a real base entry', () => {
    const baseIds = new Set(base.map(p => p.id))
    const orphans = variants.filter(p => !baseIds.has(p.variantOf))
    expect(orphans.map(p => p.variantSlug)).toEqual([])
  })

  test('variantIndex is unique per base pokemon', () => {
    const grouped = {}
    for (const v of variants) {
      const key = v.variantOf
      grouped[key] = grouped[key] ?? []
      grouped[key].push(v.variantIndex)
    }
    for (const [id, indices] of Object.entries(grouped)) {
      expect({ duplicates: indices.length !== new Set(indices).size, id: Number(id) }).toEqual({
        duplicates: false,
        id: Number(id)
      })
    }
  })
})

// ─── Shiny data ───────────────────────────────────────────────────────────────

describe('shiny data', () => {
  test('Bulbasaur shiny imageUrl uses Showdown shiny sprite pattern', () => {
    const bulbasaur = getBase(1)
    expect(bulbasaur.shiny.imageUrl).toMatch(
      /play\.pokemonshowdown\.com\/sprites\/ani-shiny\//
    )
  })

  test('Bulbasaur shiny officialUrl points to GitHub artwork shiny path', () => {
    const bulbasaur = getBase(1)
    expect(bulbasaur.shiny.officialUrl).toMatch(
      /sprites\/pokemon\/other\/official-artwork\/shiny\/1\.png/
    )
  })

  test('variant entries have their own shiny URLs (not base)', () => {
    const charizardMegaX = getVariantBySlug('charizard-mega-x')
    expect(charizardMegaX.shiny.imageUrl).toMatch(/charizardmegax/)
  })
})

// ─── Female data ─────────────────────────────────────────────────────────────

describe('female data', () => {
  test('Pokémon without visual gender differences have female: null', () => {
    expect(getBase(1).female).toBeNull()   // Bulbasaur
    expect(getBase(81).female).toBeNull()  // Magnemite (genderless)
    expect(getBase(150).female).toBeNull() // Mewtwo (genderless)
  })

  test('Pokémon with visual differences have female object', () => {
    // Unfezant (#521) has a distinct female sprite
    const unfezant = getBase(521)
    expect(unfezant.female).not.toBeNull()
    expect(unfezant.female.imageUrl).toBeTruthy()
  })
})

// ─── Gigantamax data ──────────────────────────────────────────────────────────

describe('gigantamax data', () => {
  test('Venusaur (#3) has a Gigantamax form embedded', () => {
    const venusaur = getBase(3)
    expect(venusaur.gigantamax).not.toBeNull()
    expect(venusaur.gigantamax.imageUrl).toBeTruthy()
  })

  test('Charizard (#6) has a Gigantamax form embedded', () => {
    const charizard = getBase(6)
    expect(charizard.gigantamax).not.toBeNull()
    expect(charizard.gigantamax.imageUrl).toBeTruthy()
  })

  test('Gigantamax form has gmaxMoves array', () => {
    const withGmax = base.filter(p => p.gigantamax !== null)
    expect(withGmax.length).toBeGreaterThan(0)
    for (const p of withGmax) {
      expect(Array.isArray(p.gigantamax.gmaxMoves)).toBe(true)
    }
  })

  test('Gigantamax does NOT get its own separate entry', () => {
    const gmaxEntries = data.filter(p => p.variantType === 'gigantamax')
    expect(gmaxEntries).toEqual([])
  })

  test('Pokémon without Gigantamax have gigantamax: null', () => {
    expect(getBase(1).gigantamax).toBeNull()  // Bulbasaur
    expect(getBase(4).gigantamax).toBeNull()  // Charmander
  })
})

// ─── Mega evolutions ──────────────────────────────────────────────────────────

describe('mega evolutions', () => {
  test('Venusaur Mega has correct signature ability (Thick Fat)', () => {
    const mega = getVariantBySlug('venusaur-mega')
    const abilityNames = mega.abilities.map(a => a.name)
    expect(abilityNames).toContain('thick fat')
  })

  test('Mega Charizard X types are Fire/Dragon, not Fire/Flying', () => {
    const megaX = getVariantBySlug('charizard-mega-x')
    expect(megaX.types).toEqual(['Fire', 'Dragon'])
  })

  test('Mega Charizard Y types remain Fire/Flying', () => {
    const megaY = getVariantBySlug('charizard-mega-y')
    expect(megaY.types).toEqual(['Fire', 'Flying'])
  })

  test('Mega Charizard X has Ground immunity (Dragon type removes it)', () => {
    const megaX = getVariantBySlug('charizard-mega-x')
    // Fire/Dragon loses the Flying-type Ground immunity — Ground should now hit normally
    const groundImmunity = megaX.typeMatchups.immunities.includes('Ground')
    expect(groundImmunity).toBe(false)
  })

  test('Mega Gyarados types are Water/Dark (not Water/Flying)', () => {
    const mega = getVariantBySlug('gyarados-mega')
    expect(mega.types).toEqual(['Water', 'Dark'])
  })

  test('Mewtwo has both Mega-X and Mega-Y entries', () => {
    const megaX = getVariantBySlug('mewtwo-mega-x')
    const megaY = getVariantBySlug('mewtwo-mega-y')
    expect(megaX).toBeDefined()
    expect(megaY).toBeDefined()
    expect(megaX.variantType).toBe('mega-x')
    expect(megaY.variantType).toBe('mega-y')
  })

  test('Mega entries have higher BST than base', () => {
    const bst = p =>
      p.hp + p.attack + p.defense + p.specialAttack + p.specialDefense + p.speed

    const venusaur = getBase(3)
    const megaVenusaur = getVariantBySlug('venusaur-mega')
    expect(bst(megaVenusaur)).toBeGreaterThan(bst(venusaur))

    const charizard = getBase(6)
    const megaCharizardX = getVariantBySlug('charizard-mega-x')
    expect(bst(megaCharizardX)).toBeGreaterThan(bst(charizard))
  })

  test('Mega entries inherit bio data from base', () => {
    const mega = getVariantBySlug('venusaur-mega')
    const base = getBase(3)
    expect(mega.description).toBe(base.description)
    expect(mega.genderRate).toBe(base.genderRate)
    expect(mega.catchRate).toBe(base.catchRate)
  })

  test('Mega entry variantOf matches base id', () => {
    const mega = getVariantBySlug('venusaur-mega')
    expect(mega.variantOf).toBe(3)
    expect(mega.id).toBe(3)
  })
})

// ─── Regional forms ───────────────────────────────────────────────────────────

describe('regional forms', () => {
  test('Alolan Ninetales types are Ice/Fairy (not Fire)', () => {
    const alolan = getVariantBySlug('ninetales-alola')
    expect(alolan.types).toEqual(['Ice', 'Fairy'])
  })

  test('Alolan Exeggutor type is Grass/Dragon (not Grass/Psychic)', () => {
    const alolan = getVariantBySlug('exeggutor-alola')
    expect(alolan.types).toEqual(['Grass', 'Dragon'])
  })

  test('Galarian Weezing types are Poison/Fairy', () => {
    const galarian = getVariantBySlug('weezing-galar')
    expect(galarian.types).toEqual(['Poison', 'Fairy'])
  })

  test('Hisuian Zorua types are Normal/Ghost', () => {
    const hisuian = getVariantBySlug('zorua-hisui')
    expect(hisuian.types).toEqual(['Normal', 'Ghost'])
  })

  test('regional forms have their own learnset (not empty)', () => {
    const alolan = getVariantBySlug('ninetales-alola')
    const totalMoves =
      alolan.learnset.levelUp.length +
      alolan.learnset.egg.length +
      alolan.learnset.machine.length
    expect(totalMoves).toBeGreaterThan(0)
  })

  test('regional type matchups reflect new typing', () => {
    // Alolan Ninetales (Ice/Fairy) should be weak to Steel and Fire
    const alolan = getVariantBySlug('ninetales-alola')
    const weakTypes = alolan.typeMatchups.weaknesses.map(w => w.type)
    expect(weakTypes).toContain('Steel')
    expect(weakTypes).toContain('Fire')
  })

  test('regional forms inherit bio data from base', () => {
    const alolan = getVariantBySlug('ninetales-alola')
    const baseNinetales = getBase(38)
    expect(alolan.catchRate).toBe(baseNinetales.catchRate)
    expect(alolan.generation).toBe(baseNinetales.generation)
  })

  test('regional form variantOf matches base id', () => {
    const alolan = getVariantBySlug('ninetales-alola')
    expect(alolan.variantOf).toBe(38)
    expect(alolan.id).toBe(38)
  })

  test('Galarian forms are present', () => {
    expect(getVariantBySlug('meowth-galar')).toBeDefined()
    expect(getVariantBySlug('ponyta-galar')).toBeDefined()
    expect(getVariantBySlug('weezing-galar')).toBeDefined()
  })

  test('Hisuian forms are present', () => {
    expect(getVariantBySlug('growlithe-hisui')).toBeDefined()
    expect(getVariantBySlug('typhlosion-hisui')).toBeDefined()
    expect(getVariantBySlug('zorua-hisui')).toBeDefined()
  })
})

// ─── Type matchup integrity ───────────────────────────────────────────────────

describe('type matchup integrity', () => {
  test('Normal type has Ghost immunity', () => {
    const rattata = getBase(19)
    expect(rattata.typeMatchups.immunities).toContain('Ghost')
  })

  test('Ghost type has Normal and Fighting immunities', () => {
    const gastly = getBase(92)
    expect(gastly.typeMatchups.immunities).toContain('Normal')
    expect(gastly.typeMatchups.immunities).toContain('Fighting')
  })

  test('Steel type has many resistances', () => {
    const magnemite = getBase(81)
    expect(magnemite.typeMatchups.resistances.length).toBeGreaterThanOrEqual(6)
  })
})
