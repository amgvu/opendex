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

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
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

  return {
    _evolutionChainUrl: species.evolution_chain?.url ?? null,
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
    flavorTexts,
    genderRate: species.gender_rate,
    generation: GENERATION_MAP[species.generation.name] ?? 1,
    genus: genusEntry?.genus ?? undefined,
    growthRate: species.growth_rate?.name ?? undefined,
    habitat: species.habitat?.name ?? null,
    height: parseFloat((pokemon.height / 10).toFixed(1)),
    heldItems,
    hp: stats['hp'],
    id: pokemon.id,
    imageUrl: `https://play.pokemonshowdown.com/sprites/ani/${species.name.replace(/-/g, '')}.gif`,
    isLegendary: species.is_legendary,
    isMythical: species.is_mythical,
    learnset: extractLearnset(pokemon.moves),
    name: pokemon.name,
    officialUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`,
    specialAttack: stats['special-attack'],
    specialDefense: stats['special-defense'],
    speed: stats['speed'],
    types,
    weight: parseFloat((pokemon.weight * 0.220462).toFixed(1))
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
    const cleaned = e.flavor_text.replace(/[\n\f\r]/g, ' ').trim()
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
        abilityDescriptions[name] = entry?.short_effect ?? ''
      })
    )
    console.log(
      `  Abilities: ${Math.min(i + CHUNK_SIZE, abilityNames.length)}/${abilityNames.length}`
    )
  }

  // Attach ability descriptions and strip URL
  for (const p of results) {
    p.abilities = p.abilities.map(({ isHidden, name }) => ({
      description: abilityDescriptions[name] ?? '',
      isHidden,
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
        moveDetails[name] = {
          accuracy: data.accuracy,
          category: data.damage_class?.name ?? 'status',
          power: data.power,
          pp: data.pp,
          type: capitalize(data.type?.name ?? 'normal')
        }
      })
    )
    console.log(
      `  Moves: ${Math.min(i + CHUNK_SIZE, moveNames.length)}/${moveNames.length}`
    )
  }

  // Attach move details — level-up gets level preserved, egg/machine become MoveDetail objects
  for (const p of results) {
    p.learnset.levelUp = p.learnset.levelUp.map(({ _url, ...rest }) => ({
      ...rest,
      ...(moveDetails[rest.name] ?? {})
    }))
    p.learnset.egg = p.learnset.egg.map(name => ({
      name,
      ...(moveDetails[name] ?? { accuracy: null, category: 'status', power: null, pp: 0, type: 'Normal' })
    }))
    p.learnset.machine = p.learnset.machine.map(name => ({
      name,
      ...(moveDetails[name] ?? { accuracy: null, category: 'status', power: null, pp: 0, type: 'Normal' })
    }))
  }

  const outputPath = path.join(__dirname, '..', 'src', 'data', 'pokemon.json')
  fs.mkdirSync(path.dirname(outputPath), { recursive: true })
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2))

  console.log(`\nDone! Saved ${results.length} Pokemon to ${outputPath}`)
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

main().catch(err => {
  console.error(err)
  process.exit(1)
})
