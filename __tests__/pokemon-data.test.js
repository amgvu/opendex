const data = require('../src/data/pokemon.json')

// ─── Helpers ──────────────────────────────────────────────────────────────────

const base = data.filter(p => !p.variantType)
const variants = data.filter(p => p.variantType)

function getBase(id) {
  return data.find(p => p.id === id && !p.variantType)
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
    'heightM', 'heightFt', 'weightKg', 'weightLbs',
    'isBaby', 'shape', 'encounterLocations',
    ...STAT_FIELDS
  ]

  test.each(REQUIRED)('every entry has field: %s', field => {
    const missing = data.filter(p => p[field] === undefined)
    expect(missing.map(p => p.variantSlug ?? p.name)).toEqual([])
  })

  test('no entry has legacy height or weight fields', () => {
    const badHeight = data.filter(p => 'height' in p)
    const badWeight = data.filter(p => 'weight' in p)
    expect(badHeight.map(p => p.variantSlug ?? p.name)).toEqual([])
    expect(badWeight.map(p => p.variantSlug ?? p.name)).toEqual([])
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
      expect({ field, missing: bad.map(p => p.name) }).toEqual({ field, missing: [] })
    }
  })
})

// ─── Variant identification fields ────────────────────────────────────────────

describe('variant identification fields', () => {
  test('every variant has variantIndex, variantOf, variantSlug, variantType', () => {
    const FIELDS = ['variantIndex', 'variantOf', 'variantSlug', 'variantType']
    for (const field of FIELDS) {
      const bad = variants.filter(p => p[field] === undefined || p[field] === null)
      expect({ field, missing: bad.map(p => p.variantSlug) }).toEqual({ field, missing: [] })
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
      grouped[v.variantOf] = grouped[v.variantOf] ?? []
      grouped[v.variantOf].push(v.variantIndex)
    }
    for (const [id, indices] of Object.entries(grouped)) {
      expect({ duplicates: indices.length !== new Set(indices).size, id: Number(id) }).toEqual({
        duplicates: false,
        id: Number(id)
      })
    }
  })
})

// ─── Height & weight ──────────────────────────────────────────────────────────

describe('height and weight', () => {
  test('heightM is a positive number', () => {
    const bad = data.filter(p => typeof p.heightM !== 'number' || p.heightM <= 0)
    expect(bad.map(p => p.variantSlug ?? p.name)).toEqual([])
  })

  test('heightFt matches feet\'inches format', () => {
    const bad = data.filter(p => !/^\d+'\d{2}"$/.test(p.heightFt))
    expect(bad.map(p => p.variantSlug ?? p.name)).toEqual([])
  })

  test('weightKg is a non-negative number', () => {
    const bad = data.filter(p => typeof p.weightKg !== 'number' || p.weightKg < 0)
    expect(bad.map(p => p.variantSlug ?? p.name)).toEqual([])
  })

  test('weightLbs is a non-negative number', () => {
    const bad = data.filter(p => typeof p.weightLbs !== 'number' || p.weightLbs < 0)
    expect(bad.map(p => p.variantSlug ?? p.name)).toEqual([])
  })

  test('Bulbasaur has correct metric values', () => {
    const bulbasaur = getBase(1)
    expect(bulbasaur.heightM).toBe(0.7)
    expect(bulbasaur.weightKg).toBe(6.9)
  })

  test('Bulbasaur imperial values are in the right ballpark', () => {
    const bulbasaur = getBase(1)
    expect(bulbasaur.heightFt).toBe("2'04\"")
    expect(bulbasaur.weightLbs).toBeCloseTo(15.2, 1)
  })

  test('weightKg and weightLbs are consistent (lbs ≈ kg × 2.205)', () => {
    const bad = data.filter(p => {
      const expected = parseFloat((p.weightKg * 2.20462).toFixed(1))
      return Math.abs(p.weightLbs - expected) > 0.2
    })
    expect(bad.map(p => p.variantSlug ?? p.name)).toEqual([])
  })
})

// ─── isBaby ───────────────────────────────────────────────────────────────────

describe('isBaby', () => {
  test('isBaby is a boolean on every entry', () => {
    const bad = data.filter(p => typeof p.isBaby !== 'boolean')
    expect(bad.map(p => p.variantSlug ?? p.name)).toEqual([])
  })

  test('known baby Pokemon are flagged', () => {
    expect(getBase(172).isBaby).toBe(true)  // Pichu
    expect(getBase(173).isBaby).toBe(true)  // Cleffa
    expect(getBase(174).isBaby).toBe(true)  // Igglybuff
    expect(getBase(175).isBaby).toBe(true)  // Togepi
    expect(getBase(236).isBaby).toBe(true)  // Tyrogue
  })

  test('non-baby Pokemon are not flagged', () => {
    expect(getBase(1).isBaby).toBe(false)   // Bulbasaur
    expect(getBase(25).isBaby).toBe(false)  // Pikachu
    expect(getBase(150).isBaby).toBe(false) // Mewtwo
  })
})

// ─── Shape ────────────────────────────────────────────────────────────────────

describe('shape', () => {
  test('shape is a string or null on every entry', () => {
    const bad = data.filter(p => p.shape !== null && typeof p.shape !== 'string')
    expect(bad.map(p => p.variantSlug ?? p.name)).toEqual([])
  })

  test('most entries have a non-null shape', () => {
    const withShape = data.filter(p => p.shape !== null)
    expect(withShape.length).toBeGreaterThan(data.length * 0.95)
  })

  test('Bulbasaur has a quadruped shape', () => {
    expect(getBase(1).shape).toBe('quadruped')
  })
})

// ─── Encounter locations ──────────────────────────────────────────────────────

describe('encounterLocations', () => {
  test('encounterLocations is an array on every entry', () => {
    const bad = data.filter(p => !Array.isArray(p.encounterLocations))
    expect(bad.map(p => p.variantSlug ?? p.name)).toEqual([])
  })

  test('starter-only Pokemon have no wild encounter locations', () => {
    expect(getBase(810).encounterLocations).toEqual([])  // Grookey
    expect(getBase(813).encounterLocations).toEqual([])  // Scorbunny
    expect(getBase(816).encounterLocations).toEqual([])  // Sobble
  })

  test('common wild Pokemon have encounter locations', () => {
    const rattata = getBase(19) // found in many routes
    expect(rattata.encounterLocations.length).toBeGreaterThan(0)
  })

  test('each encounter location has location string and versions array', () => {
    const withEncounters = data.filter(p => p.encounterLocations.length > 0)
    expect(withEncounters.length).toBeGreaterThan(0)
    for (const p of withEncounters.slice(0, 20)) {
      for (const enc of p.encounterLocations) {
        expect(typeof enc.location).toBe('string')
        expect(Array.isArray(enc.versions)).toBe(true)
        expect(enc.versions.length).toBeGreaterThan(0)
      }
    }
  })

  test('no temp _encounterUrl fields left in data', () => {
    const bad = data.filter(p => '_encounterUrl' in p)
    expect(bad.map(p => p.variantSlug ?? p.name)).toEqual([])
  })
})

// ─── Ability descriptions ─────────────────────────────────────────────────────

describe('ability descriptions', () => {
  test('every ability has description (short) string', () => {
    const bad = data.filter(p =>
      p.abilities.some(a => typeof a.description !== 'string')
    )
    expect(bad.map(p => p.variantSlug ?? p.name)).toEqual([])
  })

  test('every ability has longEffect string', () => {
    const bad = data.filter(p =>
      p.abilities.some(a => typeof a.longEffect !== 'string')
    )
    expect(bad.map(p => p.variantSlug ?? p.name)).toEqual([])
  })

  test('most abilities have non-empty descriptions', () => {
    const allAbilities = data.flatMap(p => p.abilities)
    const withDesc = allAbilities.filter(a => a.description.length > 0)
    expect(withDesc.length).toBeGreaterThan(allAbilities.length * 0.9)
  })

  test('Bulbasaur Overgrow has short and long descriptions', () => {
    const overgrow = getBase(1).abilities.find(a => a.name === 'overgrow')
    expect(overgrow.description.length).toBeGreaterThan(0)
    expect(overgrow.longEffect.length).toBeGreaterThan(overgrow.description.length)
  })
})

// ─── Move details ─────────────────────────────────────────────────────────────

describe('move details', () => {
  test('every learnset move has effect and shortEffect strings', () => {
    const categories = ['levelUp', 'egg', 'machine']
    const bad = []
    for (const p of data) {
      for (const cat of categories) {
        for (const move of p.learnset[cat]) {
          if (typeof move.effect !== 'string' || typeof move.shortEffect !== 'string') {
            bad.push(`${p.variantSlug ?? p.name}:${move.name}`)
          }
        }
      }
    }
    expect(bad).toEqual([])
  })

  test('every learnset move has type, category, pp', () => {
    const categories = ['levelUp', 'egg', 'machine']
    const bad = []
    for (const p of data) {
      for (const cat of categories) {
        for (const move of p.learnset[cat]) {
          if (typeof move.type !== 'string' || typeof move.category !== 'string' || move.pp === undefined) {
            bad.push(`${p.variantSlug ?? p.name}:${move.name}`)
          }
        }
      }
    }
    expect(bad).toEqual([])
  })

  test('levelUp moves have a level field', () => {
    const bad = []
    for (const p of data) {
      for (const move of p.learnset.levelUp) {
        if (typeof move.level !== 'number') {
          bad.push(`${p.variantSlug ?? p.name}:${move.name}`)
        }
      }
    }
    expect(bad).toEqual([])
  })

  test('most damaging moves have non-empty shortEffect', () => {
    const damagingMoves = data
      .flatMap(p => [...p.learnset.levelUp, ...p.learnset.machine])
      .filter(m => m.power !== null)
    const withEffect = damagingMoves.filter(m => m.shortEffect.length > 0)
    expect(withEffect.length).toBeGreaterThan(damagingMoves.length * 0.8)
  })

  test('Gigantamax moves have effect and shortEffect fields when present', () => {
    const withGmaxMoves = base.filter(p => p.gigantamax?.gmaxMoves?.length > 0)
    for (const p of withGmaxMoves) {
      for (const move of p.gigantamax.gmaxMoves) {
        expect(typeof move.effect).toBe('string')
        expect(typeof move.shortEffect).toBe('string')
      }
    }
  })
})

// ─── Shiny data ───────────────────────────────────────────────────────────────

describe('shiny data', () => {
  test('Bulbasaur shiny imageUrl uses Showdown shiny sprite pattern', () => {
    const bulbasaur = getBase(1)
    expect(bulbasaur.shiny.imageUrl).toMatch(/play\.pokemonshowdown\.com\/sprites\/ani-shiny\//)
  })

  test('Bulbasaur shiny officialUrl points to GitHub artwork shiny path', () => {
    const bulbasaur = getBase(1)
    expect(bulbasaur.shiny.officialUrl).toMatch(/sprites\/pokemon\/other\/official-artwork\/shiny\/1\.png/)
  })

  test('variant entries have their own shiny URLs (not base)', () => {
    const charizardMegaX = getVariantBySlug('charizard-mega-x')
    expect(charizardMegaX.shiny.imageUrl).toMatch(/charizard-megax/)
  })
})

// ─── Female data ─────────────────────────────────────────────────────────────

describe('female data', () => {
  test('Pokémon without visual gender differences have female: null', () => {
    expect(getBase(1).female).toBeNull()    // Bulbasaur
    expect(getBase(81).female).toBeNull()   // Magnemite (genderless)
    expect(getBase(150).female).toBeNull()  // Mewtwo (genderless)
  })

  test('Pokémon with visual differences have female object', () => {
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
    expect(mega.abilities.map(a => a.name)).toContain('thick fat')
  })

  test('Mega Charizard X types are Fire/Dragon, not Fire/Flying', () => {
    expect(getVariantBySlug('charizard-mega-x').types).toEqual(['Fire', 'Dragon'])
  })

  test('Mega Charizard Y types remain Fire/Flying', () => {
    expect(getVariantBySlug('charizard-mega-y').types).toEqual(['Fire', 'Flying'])
  })

  test('Mega Charizard X has no Ground immunity (Dragon type removes it)', () => {
    const megaX = getVariantBySlug('charizard-mega-x')
    expect(megaX.typeMatchups.immunities.includes('Ground')).toBe(false)
  })

  test('Mega Gyarados types are Water/Dark (not Water/Flying)', () => {
    expect(getVariantBySlug('gyarados-mega').types).toEqual(['Water', 'Dark'])
  })

  test('Mewtwo has both Mega-X and Mega-Y entries', () => {
    const megaX = getVariantBySlug('mewtwo-mega-x')
    const megaY = getVariantBySlug('mewtwo-mega-y')
    expect(megaX?.variantType).toBe('mega-x')
    expect(megaY?.variantType).toBe('mega-y')
  })

  test('Mega entries have higher BST than base', () => {
    const bst = p => p.hp + p.attack + p.defense + p.specialAttack + p.specialDefense + p.speed
    expect(bst(getVariantBySlug('venusaur-mega'))).toBeGreaterThan(bst(getBase(3)))
    expect(bst(getVariantBySlug('charizard-mega-x'))).toBeGreaterThan(bst(getBase(6)))
  })

  test('Mega entries inherit bio data from base', () => {
    const mega = getVariantBySlug('venusaur-mega')
    const venusaur = getBase(3)
    expect(mega.description).toBe(venusaur.description)
    expect(mega.genderRate).toBe(venusaur.genderRate)
    expect(mega.catchRate).toBe(venusaur.catchRate)
  })

  test('Mega entry variantOf and id match base', () => {
    const mega = getVariantBySlug('venusaur-mega')
    expect(mega.variantOf).toBe(3)
    expect(mega.id).toBe(3)
  })
})

// ─── Regional forms ───────────────────────────────────────────────────────────

describe('regional forms', () => {
  test('Alolan Ninetales types are Ice/Fairy (not Fire)', () => {
    expect(getVariantBySlug('ninetales-alola').types).toEqual(['Ice', 'Fairy'])
  })

  test('Alolan Exeggutor type is Grass/Dragon (not Grass/Psychic)', () => {
    expect(getVariantBySlug('exeggutor-alola').types).toEqual(['Grass', 'Dragon'])
  })

  test('Galarian Weezing types are Poison/Fairy', () => {
    expect(getVariantBySlug('weezing-galar').types).toEqual(['Poison', 'Fairy'])
  })

  test('Hisuian Zorua types are Normal/Ghost', () => {
    expect(getVariantBySlug('zorua-hisui').types).toEqual(['Normal', 'Ghost'])
  })

  test('regional forms have their own learnset (not empty)', () => {
    const alolan = getVariantBySlug('ninetales-alola')
    const totalMoves =
      alolan.learnset.levelUp.length + alolan.learnset.egg.length + alolan.learnset.machine.length
    expect(totalMoves).toBeGreaterThan(0)
  })

  test('regional type matchups reflect new typing', () => {
    const weakTypes = getVariantBySlug('ninetales-alola').typeMatchups.weaknesses.map(w => w.type)
    expect(weakTypes).toContain('Steel')
    expect(weakTypes).toContain('Fire')
  })

  test('regional forms inherit bio data from base', () => {
    const alolan = getVariantBySlug('ninetales-alola')
    const ninetales = getBase(38)
    expect(alolan.catchRate).toBe(ninetales.catchRate)
    expect(alolan.generation).toBe(ninetales.generation)
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

// ─── Extended Forms & Deduplication ───────────────────────────────────────────

describe('extended forms & deduplication', () => {
  test('Magearna-Original appears exactly once (not duplicated)', () => {
    const entries = data.filter(p => p.variantSlug === 'magearna-original')
    expect(entries.length).toBe(1)
  })

  test('Ogerpon mask forms are present', () => {
    expect(getVariantBySlug('ogerpon-wellspring-mask')).toBeDefined()
    expect(getVariantBySlug('ogerpon-hearthflame-mask')).toBeDefined()
    expect(getVariantBySlug('ogerpon-cornerstone-mask')).toBeDefined()
  })

  test('Terapagos stellar form is present', () => {
    expect(getVariantBySlug('terapagos-stellar')).toBeDefined()
  })

  test('Ursaluna Bloodmoon form is present', () => {
    expect(getVariantBySlug('ursaluna-bloodmoon')).toBeDefined()
  })

  test('variants without specific PokeAPI artwork fall back to base artwork', () => {
    const variantsWithoutArtwork = variants.filter(v => !v.officialUrl)
    expect(variantsWithoutArtwork.length).toBe(0)
  })
})

// ─── Type matchup integrity ───────────────────────────────────────────────────

describe('type matchup integrity', () => {
  test('Normal type has Ghost immunity', () => {
    expect(getBase(19).typeMatchups.immunities).toContain('Ghost')
  })

  test('Ghost type has Normal and Fighting immunities', () => {
    const gastly = getBase(92)
    expect(gastly.typeMatchups.immunities).toContain('Normal')
    expect(gastly.typeMatchups.immunities).toContain('Fighting')
  })

  test('Steel type has many resistances', () => {
    expect(getBase(81).typeMatchups.resistances.length).toBeGreaterThanOrEqual(6)
  })
})
