import { getPlaiceholder } from 'plaiceholder'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dataPath = path.join(__dirname, '..', 'src', 'data', 'pokemon.json')
const pokemon = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))

const CONCURRENCY = 20

async function getBlurDataURL(url) {
  try {
    const res = await fetch(url)
    const buffer = Buffer.from(await res.arrayBuffer())
    const { base64 } = await getPlaiceholder(buffer)
    return base64
  } catch (e) {
    console.error(`Failed for ${url}: ${e.message}`)
    return null
  }
}

for (let i = 0; i < pokemon.length; i += CONCURRENCY) {
  const batch = pokemon.slice(i, i + CONCURRENCY)
  const results = await Promise.all(batch.map(p => getBlurDataURL(p.officialUrl)))
  results.forEach((blurDataURL, j) => {
    if (blurDataURL) pokemon[i + j].blurDataURL = blurDataURL
  })
  console.log(`${Math.min(i + CONCURRENCY, pokemon.length)}/${pokemon.length}`)
}

fs.writeFileSync(dataPath, JSON.stringify(pokemon, null, 2))
console.log('Done — blurDataURL added to all pokemon')
