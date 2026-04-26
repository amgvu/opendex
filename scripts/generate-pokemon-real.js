const fs = require('fs')
const path = require('path')

const POKEAPI = 'https://pokeapi.co/api/v2'
const TOTAL = 1025
const CHUNK_SIZE = 20

const GENERATION_MAP = {
  'generation-i': 1,
  'generation-ii': 2,
  'generation-iii': 3,
  'generation-iv': 4,
  'generation-ix': 9,
  'generation-v': 5,
  'generation-vi': 6,
  'generation-vii': 7,
  'generation-viii': 8
}

// Priority order for picking which game's moveset to use (latest first)
const VERSION_GROUP_PRIORITY = [
  'scarlet-violet',
  'sword-shield',
  'brilliant-diamond-shining-pearl',
  'legends-arceus',
  'ultra-sun-ultra-moon',
  'sun-moon',
  'omega-ruby-alpha-sapphire',
  'x-y',
  'black-2-white-2',
  'black-white',
  'heartgold-soulsilver',
  'platinum',
  'diamond-pearl',
  'firered-leafgreen',
  'emerald',
  'ruby-sapphire',
  'crystal',
  'gold-silver',
  'red-blue',
  'yellow'
]

// The 18 battle types used for damage calculations (excludes shadow/unknown)
const BATTLE_TYPES = [
  'normal',
  'fire',
  'water',
  'electric',
  'grass',
  'ice',
  'fighting',
  'poison',
  'ground',
  'flying',
  'psychic',
  'bug',
  'rock',
  'ghost',
  'dragon',
  'dark',
  'steel',
  'fairy'
]

// Variant types that become separate entries (vs embedded in base)
const REGIONAL_TYPES = new Set(['alolan', 'galarian', 'hisuian', 'paldean'])

// Forms that Showdown keeps hyphenated in their sprite filenames
const HYPHENATED_SHOWDOWN_FORMS = [
  '-origin', '-therian', '-resolute', '-pirouette', '-ash', '-complete',
  '-school', '-meteor', '-ultra', '-crowned', '-rapid-strike', '-single-strike',
  '-ice', '-shadow', '-wellspring', '-hearthflame', '-cornerstone', '-stellar',
  '-bloodmoon'
]

function buildMoveDetails(data) {
  const enEntry = data.effect_entries?.find(e => e.language.name === 'en')
  const effectChance = data.effect_chance != null ? String(data.effect_chance) : ''
  return {
    accuracy: data.accuracy,
    category: data.damage_class?.name ?? 'status',
    effect: enEntry?.effect?.replace(/\$effect_chance/g, effectChance).replace(/\s+/g, ' ').trim() ?? '',
    power: data.power,
    pp: data.pp,
    shortEffect: enEntry?.short_effect?.replace(/\$effect_chance/g, effectChance).trim() ?? '',
    type: capitalize(data.type?.name ?? 'normal')
  }
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function classifyVariant(slug) {
  const s = slug.toLowerCase()
  if (s.endsWith('-mega-x')) return 'mega-x'
  if (s.endsWith('-mega-y')) return 'mega-y'
  if (s.endsWith('-mega')) return 'mega'
  if (s.endsWith('-alola')) return 'alolan'
  if (s.endsWith('-galar')) return 'galarian'
  if (s.endsWith('-hisui')) return 'hisuian'
  if (s.endsWith('-paldea')) return 'paldean'
  if (s.endsWith('-gmax')) return 'gigantamax'
  if (s.endsWith('-origin')) return 'origin'
  if (s.endsWith('-therian')) return 'therian'
  if (s.endsWith('-resolute')) return 'resolute'
  if (s.endsWith('-pirouette')) return 'pirouette'
  if (s.endsWith('-ash')) return 'ash'
  if (s.endsWith('-complete')) return 'complete'
  if (s.endsWith('-school')) return 'school'
  if (s.endsWith('-ultra')) return 'ultra'
  if (s.endsWith('-crowned')) return 'crowned'
  if (s.endsWith('-rapid-strike')) return 'rapid-strike'
  if (s.endsWith('-single-strike')) return 'single-strike'
  if (s.endsWith('-ice')) return 'ice-rider'
  if (s.endsWith('-shadow')) return 'shadow-rider'
  if (s.includes('-eternamax')) return 'eternamax'
  if (s.includes('-wellspring')) return 'wellspring-mask'
  if (s.includes('-hearthflame')) return 'hearthflame-mask'
  if (s.includes('-cornerstone')) return 'cornerstone-mask'
  if (s.includes('-stellar')) return 'stellar'
  return 'form'
}

// Compute weaknesses/resistances/immunities for a Pokemon given its types
// typeChart: { 'fire': { double_damage_from: ['water',...], half_damage_from: [...], no_damage_from: [...] } }
function computeTypeMatchups(pokemonTypes, typeChart) {
  const weaknesses = []
  const resistances = []
  const immunities = []

  for (const attacker of BATTLE_TYPES) {
    let multiplier = 1

    for (const defType of pokemonTypes) {
      const chart = typeChart[defType.toLowerCase()]
      if (!chart) continue
      if (chart.no_damage_from.includes(attacker)) {
        multiplier = 0
        break
      }
      if (chart.double_damage_from.includes(attacker)) multiplier *= 2
      if (chart.half_damage_from.includes(attacker)) multiplier *= 0.5
    }

    const typeName = capitalize(attacker)
    if (multiplier === 0) immunities.push(typeName)
    else if (multiplier < 1) resistances.push({ multiplier, type: typeName })
    else if (multiplier > 1) weaknesses.push({ multiplier, type: typeName })
  }

  immunities.sort()
  resistances.sort(
    (a, b) => a.multiplier - b.multiplier || a.type.localeCompare(b.type)
  )
  weaknesses.sort(
    (a, b) => b.multiplier - a.multiplier || a.type.localeCompare(b.type)
  )

  return { immunities, resistances, weaknesses }
}

// Pick the most recent game version that has at least one level-up move.
// Falls back to any version group if none have level-up moves.
function extractLearnset(moves) {
  const vgsWithLevelUp = new Set()
  const vgsAny = new Set()

  for (const m of moves) {
    for (const vgd of m.version_group_details) {
      vgsAny.add(vgd.version_group.name)
      if (vgd.move_learn_method.name === 'level-up') {
        vgsWithLevelUp.add(vgd.version_group.name)
      }
    }
  }

  const bestVg =
    VERSION_GROUP_PRIORITY.find(vg => vgsWithLevelUp.has(vg)) ??
    VERSION_GROUP_PRIORITY.find(vg => vgsAny.has(vg)) ??
    [...vgsAny][0]

  if (!bestVg) return { egg: [], levelUp: [], machine: [] }

  // Use a map to deduplicate: if a move appears at multiple levels, keep lowest non-zero
  const levelUpMap = new Map()
  const egg = new Set()
  const machine = new Set()

  for (const m of moves) {
    const name = m.move.name
    const url = m.move.url

    for (const vgd of m.version_group_details) {
      if (vgd.version_group.name !== bestVg) continue
      const method = vgd.move_learn_method.name

      if (method === 'level-up') {
        const lvl = vgd.level_learned_at
        const existing = levelUpMap.get(name)
        if (
          !existing ||
          (lvl > 0 && (existing.level === 0 || lvl < existing.level))
        ) {
          levelUpMap.set(name, { _url: url, level: lvl || 1, name })
        }
      } else if (method === 'egg') {
        egg.add(name)
      } else if (method === 'machine' || method === 'tutor') {
        machine.add(name)
      }
    }
  }

  const levelUp = [...levelUpMap.values()].sort(
    (a, b) => a.level - b.level || a.name.localeCompare(b.name)
  )

  return {
    egg: [...egg].sort(),
    levelUp,
    machine: [...machine].sort()
  }
}

async function fetchPokemon(id) {
  const [pokemon, species] = await Promise.all([
    fetch(`${POKEAPI}/pokemon/${id}`).then(r => r.json()),
    fetch(`${POKEAPI}/pokemon-species/${id}`).then(r => r.json())
  ])

  const stats = Object.fromEntries(
    pokemon.stats.map(s => [s.stat.name, s.base_stat])
  )

  const types = pokemon.types
    .sort((a, b) => a.slot - b.slot)
    .map(t => capitalize(t.type.name))

  const abilities = pokemon.abilities
    .sort((a, b) => a.slot - b.slot)
    .map(a => ({
      isHidden: a.is_hidden,
      name: a.ability.name.replace(/-/g, ' '),
      url: a.ability.url
    }))

  const evYield = pokemon.stats
    .filter(s => s.effort > 0)
    .map(s => ({ stat: s.stat.name, value: s.effort }))

  const heldItems = pokemon.held_items
    .map(hi => ({
      name: hi.item.name.split('-').map(capitalize).join(' '),
      rarity: Math.max(...hi.version_details.map(vd => vd.rarity))
    }))
    .sort((a, b) => b.rarity - a.rarity)

  const flavorTexts = getEnglishFlavorTexts(species.flavor_text_entries)
  const description = flavorTexts[0]?.text ?? 'No description available.'

  const genusEntry = species.genera?.find(g => g.language.name === 'en')

  const sprites = pokemon.sprites

  // Shiny sprite URLs (same Pokemon, different palette — no stat change)
  const shiny = {
    imageUrl: `https://play.pokemonshowdown.com/sprites/ani-shiny/${species.name.replace(/-/g, '')}.gif`,
    officialUrl: sprites.other?.['official-artwork']?.front_shiny ?? null
  }

  // Female sprites — only populated when a visually distinct female form exists
  const female = sprites.front_female
    ? {
        imageUrl: sprites.front_female,
        officialUrl: sprites.other?.['official-artwork']?.front_female ?? null
      }
    : null

  return {
    _encounterUrl: pokemon.location_area_encounters,
    _evolutionChainUrl: species.evolution_chain?.url ?? null,
    _varieties: species.varieties
      .filter(v => !v.is_default)
      .map(v => v.pokemon.name),
    abilities,
    attack: stats['attack'],
    baseExperience: pokemon.base_experience ?? undefined,
    baseFriendship: species.base_happiness ?? undefined,
    catchRate: species.capture_rate,
    color: species.color?.name ?? undefined,
    defense: stats['defense'],
    description,
    eggCycles: species.hatch_counter ?? undefined,
    eggGroups:
      species.egg_groups?.map(g => g.name.replace(/-/g, ' ')) ?? undefined,
    evYield,
    female,
    flavorTexts,
    genderRate: species.gender_rate,
    generation: GENERATION_MAP[species.generation.name] ?? 1,
    genus: genusEntry?.genus ?? undefined,
    growthRate: species.growth_rate?.name ?? undefined,
    habitat: species.habitat?.name ?? null,
    heightFt: toImperialHeight(pokemon.height / 10),
    heightM: parseFloat((pokemon.height / 10).toFixed(1)),
    heldItems,
    hp: stats['hp'],
    id: pokemon.id,
    imageUrl: `https://play.pokemonshowdown.com/sprites/ani/${species.name.replace(/-/g, '')}.gif`,
    isBaby: species.is_baby,
    isLegendary: species.is_legendary,
    isMythical: species.is_mythical,
    learnset: extractLearnset(pokemon.moves),
    name: pokemon.name,
    officialUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`,
    shape: species.shape?.name ?? null,
    shiny,
    specialAttack: stats['special-attack'],
    specialDefense: stats['special-defense'],
    speed: stats['speed'],
    types,
    weightKg: parseFloat((pokemon.weight / 10).toFixed(1)),
    weightLbs: parseFloat((pokemon.weight * 0.220462).toFixed(1))
  }
}

function formatTrigger(details) {
  if (!details || !details.trigger) return 'Unknown'
  const trigger = details.trigger.name
  if (trigger === 'level-up') {
    if (details.min_level) return `Lv. ${details.min_level}`
    if (details.min_happiness) return 'Happiness'
    if (details.min_beauty) return 'Beauty'
    if (details.known_move)
      return `Know ${details.known_move.name.replace(/-/g, ' ')}`
    if (details.held_item)
      return `Hold ${details.held_item.name.replace(/-/g, ' ')}`
    if (details.time_of_day)
      return `${capitalize(details.time_of_day)} (level up)`
    return 'Level up'
  }
  if (trigger === 'use-item') {
    const item = details.item?.name ?? 'item'
    return item.split('-').map(capitalize).join(' ')
  }
  if (trigger === 'trade') {
    if (details.held_item) {
      const item = details.held_item.name.replace(/-/g, ' ')
      return `Trade (${item})`
    }
    return 'Trade'
  }
  if (trigger === 'shed') return 'Shed (level 20 + empty slot)'
  if (trigger === 'spin') return 'Spin'
  if (trigger === 'tower-of-darkness') return 'Tower of Darkness'
  if (trigger === 'tower-of-waters') return 'Tower of Waters'
  if (trigger === 'three-critical-hits') return '3 critical hits'
  if (trigger === 'take-damage') return 'Take damage'
  if (trigger === 'other') return 'Special'
  return trigger.split('-').map(capitalize).join(' ')
}

function getEnglishFlavorTexts(entries) {
  const seen = new Set()
  const texts = []
  for (let i = entries.length - 1; i >= 0; i--) {
    const e = entries[i]
    if (e.language.name !== 'en') continue
    const cleaned = e.flavor_text
      .replace(/[\n\f\r]/g, ' ')
      .replace(/\u00ad/g, '')
      .replace(/\s+/g, ' ')
      .replace(/POKé/g, 'POKÉ')
      .trim()
    if (seen.has(cleaned)) continue
    seen.add(cleaned)
    texts.push({ game: e.version.name, text: cleaned })
  }
  return texts.reverse()
}

function idFromUrl(url) {
  return parseInt(url.split('/').filter(Boolean).pop(), 10)
}

async function main() {
  console.log(`Fetching ${TOTAL} Pokemon from PokeAPI...`)

  const ids = Array.from({ length: TOTAL }, (_, i) => i + 1)
  const results = []

  for (let i = 0; i < ids.length; i += CHUNK_SIZE) {
    const chunk = ids.slice(i, i + CHUNK_SIZE)
    const data = await Promise.all(chunk.map(fetchPokemon))
    results.push(...data)
    console.log(`  Fetched ${Math.min(i + CHUNK_SIZE, TOTAL)}/${TOTAL}`)
  }

  // Fetch descriptions for all unique abilities
  console.log('\nFetching ability descriptions...')
  const abilityUrls = new Map()
  for (const p of results) {
    for (const a of p.abilities) {
      if (!abilityUrls.has(a.name)) abilityUrls.set(a.name, a.url)
    }
  }
  const abilityDescriptions = {}
  const abilityNames = [...abilityUrls.keys()]
  for (let i = 0; i < abilityNames.length; i += CHUNK_SIZE) {
    const chunk = abilityNames.slice(i, i + CHUNK_SIZE)
    await Promise.all(
      chunk.map(async name => {
        const data = await fetch(abilityUrls.get(name)).then(r => r.json())
        const entry = data.effect_entries.find(e => e.language.name === 'en')
        abilityDescriptions[name] = {
          long: entry?.effect ?? '',
          short: entry?.short_effect ?? ''
        }
      })
    )
    console.log(
      `  Abilities: ${Math.min(i + CHUNK_SIZE, abilityNames.length)}/${abilityNames.length}`
    )
  }

  // Attach ability descriptions and strip URL
  for (const p of results) {
    p.abilities = p.abilities.map(({ isHidden, name }) => ({
      description: abilityDescriptions[name]?.short ?? '',
      isHidden,
      longEffect: abilityDescriptions[name]?.long ?? '',
      name
    }))
  }

  // Fetch evolution chains (deduplicated)
  console.log('\nFetching evolution chains...')
  const chainUrlToSteps = new Map()
  const uniqueChainUrls = [
    ...new Set(results.map(p => p._evolutionChainUrl).filter(Boolean))
  ]

  for (let i = 0; i < uniqueChainUrls.length; i += CHUNK_SIZE) {
    const chunk = uniqueChainUrls.slice(i, i + CHUNK_SIZE)
    await Promise.all(
      chunk.map(async url => {
        const data = await fetch(url).then(r => r.json())
        chainUrlToSteps.set(url, parseChain(data.chain))
      })
    )
    console.log(
      `  Chains: ${Math.min(i + CHUNK_SIZE, uniqueChainUrls.length)}/${uniqueChainUrls.length}`
    )
  }

  // Attach evolution chains and clean up temp field
  for (const p of results) {
    const url = p._evolutionChainUrl
    p.evolutionChain = url ? (chainUrlToSteps.get(url) ?? []) : []
    delete p._evolutionChainUrl
  }

  // Fetch the type damage chart (18 types, one-time)
  console.log('\nFetching type chart...')
  const typeChart = {}
  await Promise.all(
    BATTLE_TYPES.map(async typeName => {
      const data = await fetch(`${POKEAPI}/type/${typeName}`).then(r =>
        r.json()
      )
      typeChart[typeName] = {
        double_damage_from: data.damage_relations.double_damage_from.map(
          t => t.name
        ),
        half_damage_from: data.damage_relations.half_damage_from.map(
          t => t.name
        ),
        no_damage_from: data.damage_relations.no_damage_from.map(t => t.name)
      }
    })
  )
  console.log(`  Type chart complete (${BATTLE_TYPES.length} types)`)

  // Attach type matchups to each Pokemon
  for (const p of results) {
    p.typeMatchups = computeTypeMatchups(p.types, typeChart)
  }

  // Fetch details for all unique moves (level-up, egg, machine — deduplicated)
  console.log('\nFetching move details...')
  const moveUrlMap = new Map()
  for (const p of results) {
    for (const m of p.learnset.levelUp) {
      if (!moveUrlMap.has(m.name)) moveUrlMap.set(m.name, m._url)
    }
    for (const name of [...p.learnset.egg, ...p.learnset.machine]) {
      if (!moveUrlMap.has(name)) {
        moveUrlMap.set(name, `${POKEAPI}/move/${name}`)
      }
    }
  }

  const moveDetails = {}
  const moveNames = [...moveUrlMap.keys()]
  for (let i = 0; i < moveNames.length; i += CHUNK_SIZE) {
    const chunk = moveNames.slice(i, i + CHUNK_SIZE)
    await Promise.all(
      chunk.map(async name => {
        const data = await fetch(moveUrlMap.get(name)).then(r => r.json())
        moveDetails[name] = buildMoveDetails(data)
      })
    )
    console.log(
      `  Moves: ${Math.min(i + CHUNK_SIZE, moveNames.length)}/${moveNames.length}`
    )
  }

  // Attach move details — level-up gets level preserved, egg/machine become MoveDetail objects
  for (const p of results) {
    p.learnset = resolveLearnset(p.learnset, moveDetails)
  }

  // ─────────────────────────────────────────────────────────────────────────
  // VARIANT PROCESSING
  // ─────────────────────────────────────────────────────────────────────────

  // Collect and classify all non-default varieties from species data
  const variantsToProcess = []
  for (const p of results) {
    const varieties = p._varieties ?? []
    let variantIndex = 0
    for (const slug of varieties) {
      const variantType = classifyVariant(slug)
      variantIndex++
      variantsToProcess.push({ baseEntry: p, slug, variantIndex, variantType })
    }
    delete p._varieties
  }

  const gmaxVariants = variantsToProcess.filter(
    v => v.variantType === 'gigantamax'
  )
  const separateVariants = variantsToProcess.filter(
    v => v.variantType !== 'gigantamax'
  )
  console.log(
    `\nFound ${variantsToProcess.length} variants: ${gmaxVariants.length} Gigantamax, ${separateVariants.length} Mega/Regional`
  )

  // ── Gigantamax (embedded in base entry) ──────────────────────────────────

  if (gmaxVariants.length > 0) {
    console.log(`\nFetching ${gmaxVariants.length} Gigantamax forms...`)
    const newGmaxMoveNames = new Set()

    for (let i = 0; i < gmaxVariants.length; i += CHUNK_SIZE) {
      const chunk = gmaxVariants.slice(i, i + CHUNK_SIZE)
      await Promise.all(
        chunk.map(async ({ baseEntry, slug }) => {
          const [formData, pkmnData] = await Promise.all([
            fetch(`${POKEAPI}/pokemon-form/${slug}`).then(r => r.json()),
            fetch(`${POKEAPI}/pokemon/${slug}`).then(r => r.json())
          ])

          const gmaxMoveNames = pkmnData.moves
            .filter(m => m.move.name.startsWith('g-max'))
            .map(m => m.move.name)

          for (const n of gmaxMoveNames) {
            if (!moveDetails[n]) newGmaxMoveNames.add(n)
          }

          baseEntry.gigantamax = {
            _gmaxMoveNames: gmaxMoveNames,
            imageUrl: formData.sprites?.front_default ?? null,
            officialUrl:
              formData.sprites?.other?.['official-artwork']?.front_default ??
              null
          }
        })
      )
      console.log(
        `  Gmax: ${Math.min(i + CHUNK_SIZE, gmaxVariants.length)}/${gmaxVariants.length}`
      )
    }

    // Fetch details for any G-Max moves not already in moveDetails
    if (newGmaxMoveNames.size > 0) {
      const names = [...newGmaxMoveNames]
      console.log(`  Fetching ${names.length} G-Max move details...`)
      for (let i = 0; i < names.length; i += CHUNK_SIZE) {
        const chunk = names.slice(i, i + CHUNK_SIZE)
        await Promise.all(
          chunk.map(async name => {
            const data = await fetch(`${POKEAPI}/move/${name}`).then(r =>
              r.json()
            )
            moveDetails[name] = buildMoveDetails(data)
          })
        )
        console.log(
          `  G-Max moves: ${Math.min(i + CHUNK_SIZE, names.length)}/${names.length}`
        )
      }
    }

    // Resolve G-Max move details and clean up temp field
    for (const p of results) {
      if (p.gigantamax?._gmaxMoveNames) {
        p.gigantamax.gmaxMoves = p.gigantamax._gmaxMoveNames.map(name => ({
          name: name.split('-').map(capitalize).join(' '),
          ...(moveDetails[name] ?? {
            accuracy: null,
            category: 'status',
            effect: '',
            power: null,
            pp: null,
            shortEffect: '',
            type: 'Normal'
          })
        }))
        delete p.gigantamax._gmaxMoveNames
      }
    }
  }

  // Ensure all base Pokemon without a Gigantamax form have gigantamax: null
  for (const p of results) {
    if (!p.gigantamax) p.gigantamax = null
  }

  // ── Mega + Regional (separate entries) ───────────────────────────────────

  if (separateVariants.length > 0) {
    console.log(
      `\nFetching ${separateVariants.length} Mega/Regional variant Pokemon...`
    )

    // Step A: Fetch raw pokemon data for all separate variants
    const rawVariants = []
    for (let i = 0; i < separateVariants.length; i += CHUNK_SIZE) {
      const chunk = separateVariants.slice(i, i + CHUNK_SIZE)
      const fetched = await Promise.all(
        chunk.map(async meta => {
          const pkmnData = await fetch(`${POKEAPI}/pokemon/${meta.slug}`).then(
            r => r.json()
          )
          return { meta, pkmnData }
        })
      )
      rawVariants.push(...fetched)
      console.log(
        `  Pokemon data: ${Math.min(i + CHUNK_SIZE, separateVariants.length)}/${separateVariants.length}`
      )
    }

    // Step B: Collect and fetch any new ability descriptions introduced by variants
    const newAbilityNames = []
    for (const { pkmnData } of rawVariants) {
      for (const a of pkmnData.abilities) {
        const name = a.ability.name.replace(/-/g, ' ')
        if (!abilityUrls.has(name)) {
          abilityUrls.set(name, a.ability.url)
          newAbilityNames.push(name)
        }
      }
    }

    if (newAbilityNames.length > 0) {
      console.log(
        `\nFetching ${newAbilityNames.length} new ability descriptions...`
      )
      for (let i = 0; i < newAbilityNames.length; i += CHUNK_SIZE) {
        const chunk = newAbilityNames.slice(i, i + CHUNK_SIZE)
        await Promise.all(
          chunk.map(async name => {
            const data = await fetch(abilityUrls.get(name)).then(r => r.json())
            const entry = data.effect_entries.find(
              e => e.language.name === 'en'
            )
            abilityDescriptions[name] = {
              long: entry?.effect ?? '',
              short: entry?.short_effect ?? ''
            }
          })
        )
        console.log(
          `  Abilities: ${Math.min(i + CHUNK_SIZE, newAbilityNames.length)}/${newAbilityNames.length}`
        )
      }
    }

    // Step C: Fetch species + evolution chains for regional forms
    const regionalRaw = rawVariants.filter(({ meta }) =>
      REGIONAL_TYPES.has(meta.variantType)
    )

    if (regionalRaw.length > 0) {
      console.log(
        `\nFetching species data for ${regionalRaw.length} regional forms...`
      )

      for (let i = 0; i < regionalRaw.length; i += CHUNK_SIZE) {
        const chunk = regionalRaw.slice(i, i + CHUNK_SIZE)
        await Promise.all(
          chunk.map(async item => {
            // Regional slugs (e.g. 'vulpix-alola') have no /pokemon-species entry of their own.
            // Use the species URL from the already-fetched pokemon data instead.
            item.speciesData = await fetch(item.pkmnData.species.url).then(r =>
              r.json()
            )
          })
        )
        console.log(
          `  Regional species: ${Math.min(i + CHUNK_SIZE, regionalRaw.length)}/${regionalRaw.length}`
        )
      }

      const uniqueRegionalChainUrls = [
        ...new Set(
          regionalRaw
            .map(({ speciesData }) => speciesData?.evolution_chain?.url)
            .filter(Boolean)
        )
      ]

      console.log(
        `\nFetching ${uniqueRegionalChainUrls.length} regional evolution chains...`
      )
      for (let i = 0; i < uniqueRegionalChainUrls.length; i += CHUNK_SIZE) {
        const chunk = uniqueRegionalChainUrls.slice(i, i + CHUNK_SIZE)
        await Promise.all(
          chunk.map(async url => {
            if (!chainUrlToSteps.has(url)) {
              const data = await fetch(url).then(r => r.json())
              chainUrlToSteps.set(url, parseChain(data.chain))
            }
          })
        )
        console.log(
          `  Regional chains: ${Math.min(i + CHUNK_SIZE, uniqueRegionalChainUrls.length)}/${uniqueRegionalChainUrls.length}`
        )
      }
    }

    // Step D: Collect and fetch missing move details for regional forms
    const newMoveUrlMap = new Map()
    for (const { meta, pkmnData } of rawVariants) {
      if (!REGIONAL_TYPES.has(meta.variantType)) continue
      for (const m of pkmnData.moves) {
        const name = m.move.name
        if (!moveDetails[name] && !newMoveUrlMap.has(name)) {
          newMoveUrlMap.set(name, m.move.url)
        }
      }
    }

    if (newMoveUrlMap.size > 0) {
      console.log(
        `\nFetching ${newMoveUrlMap.size} new move details for regional forms...`
      )
      const names = [...newMoveUrlMap.keys()]
      for (let i = 0; i < names.length; i += CHUNK_SIZE) {
        const chunk = names.slice(i, i + CHUNK_SIZE)
        await Promise.all(
          chunk.map(async name => {
            const data = await fetch(newMoveUrlMap.get(name)).then(r =>
              r.json()
            )
            moveDetails[name] = buildMoveDetails(data)
          })
        )
        console.log(
          `  Moves: ${Math.min(i + CHUNK_SIZE, names.length)}/${names.length}`
        )
      }
    }

    // Step E: Assemble final variant entries
    const variantEntries = []
    const seenVariantKeys = new Set()

    for (const { meta, pkmnData, speciesData } of rawVariants) {
      const { baseEntry, slug, variantIndex, variantType } = meta
      const isRegional = REGIONAL_TYPES.has(variantType)

      const variantStats = Object.fromEntries(
        pkmnData.stats.map(s => [s.stat.name, s.base_stat])
      )

      const variantTypes = pkmnData.types
        .sort((a, b) => a.slot - b.slot)
        .map(t => capitalize(t.type.name))

      const variantAbilities = pkmnData.abilities
        .sort((a, b) => a.slot - b.slot)
        .map(a => {
          const name = a.ability.name.replace(/-/g, ' ')
          const desc = abilityDescriptions[name]
          return {
            description: desc?.short ?? '',
            isHidden: a.is_hidden,
            longEffect: desc?.long ?? '',
            name
          }
        })

      const statsKey = pkmnData.stats.map(s => s.base_stat).join(',')
      const typesKey = variantTypes.join(',')
      const abilitiesKey = variantAbilities
        .map(a => a.name)
        .sort()
        .join(',')
      const dedupeKey = `${baseEntry.id}-${variantType}-${statsKey}-${typesKey}-${abilitiesKey}`

      if (seenVariantKeys.has(dedupeKey)) {
        console.log(`  Skipping duplicate variant: ${slug}`)
        continue
      }
      seenVariantKeys.add(dedupeKey)

      const variantEvYield = pkmnData.stats
        .filter(s => s.effort > 0)
        .map(s => ({ stat: s.stat.name, value: s.effort }))

      const sprites = pkmnData.sprites
      const variantImageUrl = `https://play.pokemonshowdown.com/sprites/ani/${toShowdownSlug(slug)}.gif`
      const variantOfficialUrl =
        sprites.other?.['official-artwork']?.front_default ??
        baseEntry.officialUrl
      const variantShiny = {
        imageUrl: `https://play.pokemonshowdown.com/sprites/ani-shiny/${toShowdownSlug(slug)}.gif`,
        officialUrl:
          sprites.other?.['official-artwork']?.front_shiny ??
          baseEntry.shiny.officialUrl
      }

      let learnset = baseEntry.learnset
      let evolutionChain = baseEntry.evolutionChain

      if (isRegional) {
        learnset = resolveLearnset(extractLearnset(pkmnData.moves), moveDetails)
        const chainUrl = speciesData?.evolution_chain?.url
        evolutionChain = chainUrl
          ? (chainUrlToSteps.get(chainUrl) ?? [])
          : baseEntry.evolutionChain
      }

      variantEntries.push({
        // Temp fields (resolved in later steps)
        _encounterUrl: pkmnData.location_area_encounters,
        // Re-fetched data (differs from base)
        abilities: variantAbilities,
        attack: variantStats['attack'],
        // Inherited from base (bio/breeding data stays the same)
        baseExperience: baseEntry.baseExperience,
        baseFriendship: baseEntry.baseFriendship,
        catchRate: baseEntry.catchRate,
        color: baseEntry.color,
        defense: variantStats['defense'],
        description: baseEntry.description,
        eggCycles: baseEntry.eggCycles,
        eggGroups: baseEntry.eggGroups,
        evolutionChain,
        evYield: variantEvYield,
        female: null,
        flavorTexts: baseEntry.flavorTexts,
        genderRate: baseEntry.genderRate,
        generation: baseEntry.generation,
        genus: baseEntry.genus,
        gigantamax: null,
        growthRate: baseEntry.growthRate,
        habitat: baseEntry.habitat,
        heightFt: toImperialHeight(pkmnData.height / 10),
        heightM: parseFloat((pkmnData.height / 10).toFixed(1)),
        heldItems: baseEntry.heldItems,
        hp: variantStats['hp'],
        id: baseEntry.id,
        imageUrl: variantImageUrl,
        isBaby: baseEntry.isBaby,
        isLegendary: baseEntry.isLegendary,
        isMythical: baseEntry.isMythical,
        learnset,
        name: slug,
        officialUrl: variantOfficialUrl,
        shape: baseEntry.shape,
        shiny: variantShiny,
        specialAttack: variantStats['special-attack'],
        specialDefense: variantStats['special-defense'],
        speed: variantStats['speed'],
        typeMatchups: computeTypeMatchups(variantTypes, typeChart),
        types: variantTypes,
        // Variant identification
        variantIndex,
        variantOf: baseEntry.id,
        variantSlug: slug,
        variantType,
        weightKg: parseFloat((pkmnData.weight / 10).toFixed(1)),
        weightLbs: parseFloat((pkmnData.weight * 0.220462).toFixed(1))
      })
    }

    results.push(...variantEntries)
    console.log(`\nAdded ${variantEntries.length} variant entries`)
  }

  const entryNames = new Set(results.map(p => p.name))
  for (const p of results) {
    for (const step of (p.evolutionChain ?? [])) {
      if (!entryNames.has(step.fromName)) {
        const match = results.find(r => r.name.startsWith(step.fromName + '-') && !r.variantType)
          ?? results.find(r => r.name.startsWith(step.fromName + '-'))
        if (match) step.fromName = match.name
      }
      if (!entryNames.has(step.toName)) {
        const match = results.find(r => r.name.startsWith(step.toName + '-') && !r.variantType)
          ?? results.find(r => r.name.startsWith(step.toName + '-'))
        if (match) step.toName = match.name
      }
    }
  }

  // Fetch encounter locations for all entries (base + variants)
  console.log('\nFetching encounter locations...')
  for (let i = 0; i < results.length; i += CHUNK_SIZE) {
    const chunk = results.slice(i, i + CHUNK_SIZE)
    await Promise.all(
      chunk.map(async entry => {
        const url = entry._encounterUrl
        delete entry._encounterUrl
        if (!url) {
          entry.encounterLocations = []
          return
        }
        try {
          const data = await fetch(url).then(r => r.json())
          const locMap = new Map()
          for (const { location_area, version_details } of data) {
            const loc = location_area.name
            if (!locMap.has(loc)) locMap.set(loc, [])
            for (const vd of version_details) locMap.get(loc).push(vd.version.name)
          }
          entry.encounterLocations = [...locMap.entries()].map(
            ([location, versions]) => ({ location, versions })
          )
        } catch {
          entry.encounterLocations = []
        }
      })
    )
    console.log(
      `  Encounters: ${Math.min(i + CHUNK_SIZE, results.length)}/${results.length}`
    )
  }

  const outputPath = path.join(__dirname, '..', 'src', 'data', 'pokemon.json')
  fs.mkdirSync(path.dirname(outputPath), { recursive: true })
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2))

  const baseCount = results.filter(p => !p.variantType).length
  const variantCount = results.filter(p => p.variantType).length
  console.log(`\nDone! Saved ${results.length} entries to ${outputPath}`)
  console.log(`  ${baseCount} base Pokemon, ${variantCount} variant entries`)
  console.log('Sample:', results[0].name, '|', results[0].types.join(', '))
  console.log(
    '  typeMatchups weaknesses:',
    results[0].typeMatchups.weaknesses
      .map(w => `${w.type} ${w.multiplier}x`)
      .join(', ')
  )
  console.log('  learnset levelUp count:', results[0].learnset.levelUp.length)
  console.log('  learnset egg count:', results[0].learnset.egg.length)
  console.log('  learnset machine count:', results[0].learnset.machine.length)
  console.log('  flavorTexts count:', results[0].flavorTexts.length)
}

function parseChain(node, steps = []) {
  for (const next of node.evolves_to) {
    const details = next.evolution_details[0] ?? {}
    steps.push({
      fromId: idFromUrl(node.species.url),
      fromName: node.species.name,
      toId: idFromUrl(next.species.url),
      toName: next.species.name,
      trigger: formatTrigger(details)
    })
    parseChain(next, steps)
  }
  return steps
}

function resolveLearnset(rawLearnset, moveDetails) {
  const fallback = {
    accuracy: null,
    category: 'status',
    effect: '',
    power: null,
    pp: 0,
    shortEffect: '',
    type: 'Normal'
  }
  return {
    egg: rawLearnset.egg.map(name => ({ name, ...(moveDetails[name] ?? fallback) })),
    levelUp: rawLearnset.levelUp.map(({ _url, ...rest }) => ({
      ...rest,
      ...(moveDetails[rest.name] ?? fallback)
    })),
    machine: rawLearnset.machine.map(name => ({ name, ...(moveDetails[name] ?? fallback) }))
  }
}

// PokeAPI height is decimeters → meters; imperial as "5'11""
function toImperialHeight(meters) {
  const totalInches = meters / 0.0254
  const feet = Math.floor(totalInches / 12)
  const inches = Math.round(totalInches % 12)
  return `${feet}'${String(inches).padStart(2, '0')}"`
}

// Converts a PokeAPI slug to the Pokémon Showdown sprite filename (without .gif).
function toShowdownSlug(slug) {
  const s = slug.toLowerCase()

  // Regionals: Showdown keeps the suffix hyphen as-is
  if (s.endsWith('-alola') || s.endsWith('-galar') || s.endsWith('-hisui') || s.endsWith('-paldea'))
    return s

  // Megas: remove internal hyphens, use megax/megay
  if (s.endsWith('-mega-x')) return s.replace(/-/g, '').replace('megax', '-megax')
  if (s.endsWith('-mega-y')) return s.replace(/-/g, '').replace('megay', '-megay')
  if (s.endsWith('-mega')) return s.replace(/-/g, '').replace('mega', '-mega')

  if (HYPHENATED_SHOWDOWN_FORMS.some(f => s.endsWith(f))) return s

  // Fallback: remove all hyphens
  return s.replace(/-/g, '')
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
