import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const PUBLIC_ARTWORK = path.join(ROOT, 'public', 'artwork')
const POKEMON_JSON = path.join(ROOT, 'src', 'data', 'pokemon.json')

const CONCURRENCY = 20
const BASE = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/'

// /artwork/1.webp → { localRelative: '1.webp', remoteUrl: 'https://...1.png' }
// https://raw...1.png → { localRelative: '1.webp', remoteUrl: 'https://...1.png' }
function resolveEntry(val) {
  if (val.startsWith('/artwork/')) {
    const localRelative = val.slice('/artwork/'.length)
    const remoteSuffix = localRelative.replace(/\.webp$/, '.png')
    return { localRelative, remoteUrl: BASE + remoteSuffix }
  }
  if (val.startsWith('http')) {
    const localRelative = val.replace(BASE, '').replace(/\.png$/, '.webp')
    return { localRelative, remoteUrl: val }
  }
  return null
}

async function downloadAndConvert(remoteUrl, destAbs) {
  fs.mkdirSync(path.dirname(destAbs), { recursive: true })
  const res = await fetch(remoteUrl)
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${remoteUrl}`)
  const buf = Buffer.from(await res.arrayBuffer())
  await sharp(buf).webp({ quality: 90 }).toFile(destAbs)
}

async function runPool(tasks, concurrency) {
  let i = 0
  let done = 0
  const total = tasks.length
  async function worker() {
    while (i < tasks.length) {
      const task = tasks[i++]
      await task()
      done++
      if (done % 50 === 0 || done === total) process.stdout.write(`\r  ${done}/${total}`)
    }
  }
  await Promise.all(Array.from({ length: concurrency }, worker))
  console.log()
}

async function main() {
  const pokemon = JSON.parse(fs.readFileSync(POKEMON_JSON, 'utf8'))

  // Collect all unique entries from every officialUrl field
  const entries = new Map() // localRelative → remoteUrl
  for (const p of pokemon) {
    for (const val of [
      p.officialUrl,
      p.shiny?.officialUrl,
      p.female?.officialUrl,
      p.gigantamax?.officialUrl
    ]) {
      if (!val) continue
      const entry = resolveEntry(val)
      if (entry) entries.set(entry.localRelative, entry.remoteUrl)
    }
  }

  console.log(`Found ${entries.size} unique artwork images`)

  // Download + convert missing files
  const toDownload = [...entries.entries()].filter(([localRelative]) => {
    return !fs.existsSync(path.join(PUBLIC_ARTWORK, localRelative))
  })

  if (toDownload.length === 0) {
    console.log('All images already present, skipping download.')
  } else {
    console.log(`Downloading and converting ${toDownload.length} images (${entries.size - toDownload.length} already exist)...`)
    const tasks = toDownload.map(([localRelative, remoteUrl]) => async () => {
      await downloadAndConvert(remoteUrl, path.join(PUBLIC_ARTWORK, localRelative))
    })
    await runPool(tasks, CONCURRENCY)
  }

  // Rewrite pokemon.json to local paths (idempotent)
  console.log('Updating pokemon.json with local paths...')
  for (const p of pokemon) {
    for (const [obj, key] of [
      [p, 'officialUrl'],
      [p.shiny, 'officialUrl'],
      [p.female, 'officialUrl'],
      [p.gigantamax, 'officialUrl']
    ]) {
      if (!obj?.[key]) continue
      const entry = resolveEntry(obj[key])
      if (entry) obj[key] = `/artwork/${entry.localRelative}`
    }
  }

  fs.writeFileSync(POKEMON_JSON, JSON.stringify(pokemon, null, 2))
  console.log('Done!')
}

main().catch(err => { console.error(err); process.exit(1) })
