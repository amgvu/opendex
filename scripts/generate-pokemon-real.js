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

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
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

  return {
    attack: stats['attack'],
    defense: stats['defense'],
    description: getEnglishFlavorText(species.flavor_text_entries),
    generation: GENERATION_MAP[species.generation.name] ?? 1,
    height: parseFloat((pokemon.height / 10).toFixed(1)),
    hp: stats['hp'],
    id: pokemon.id,
    imageUrl: `https://play.pokemonshowdown.com/sprites/ani/${species.name.replace(/-/g, '')}.gif`,
    isLegendary: species.is_legendary || species.is_mythical,
    name: pokemon.name,
    officialUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`,
    specialAttack: stats['special-attack'],
    specialDefense: stats['special-defense'],
    speed: stats['speed'],
    types,
    weight: parseFloat((pokemon.weight * 0.220462).toFixed(1))
  }
}

function getEnglishFlavorText(entries) {
  const entry = entries.find(e => e.language.name === 'en')
  return entry
    ? entry.flavor_text.replace(/[\n\f\r]/g, ' ').trim()
    : 'No description available.'
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

  const outputPath = path.join(__dirname, '..', 'src', 'data', 'pokemon.json')
  fs.mkdirSync(path.dirname(outputPath), { recursive: true })
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2))

  console.log(`\nDone! Saved ${results.length} Pokemon to ${outputPath}`)
  console.log('Sample:', results[0].name, '|', results[0].types.join(', '))
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
