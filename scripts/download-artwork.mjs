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

function urlToLocalPath(url) {
  const suffix = url.replace(BASE, '') // e.g. "1.png" or "shiny/1.png"
  return suffix.replace(/\.png$/, '.webp')
}

function localPathToPublicUrl(localRelative) {
  return `/artwork/${localRelative}`
}

async function downloadAndConvert(url, destAbs) {
  fs.mkdirSync(path.dirname(destAbs), { recursive: true })
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`)
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
  const workers = Array.from({ length: concurrency }, worker)
  await Promise.all(workers)
  console.log()
}

async function main() {
  const pokemon = JSON.parse(fs.readFileSync(POKEMON_JSON, 'utf8'))

  // Collect all unique URLs
  const allUrls = new Set()
  for (const p of pokemon) {
    if (p.officialUrl) allUrls.add(p.officialUrl)
    if (p.shiny?.officialUrl) allUrls.add(p.shiny.officialUrl)
    if (p.female?.officialUrl) allUrls.add(p.female.officialUrl)
    if (p.gigantamax?.officialUrl) allUrls.add(p.gigantamax.officialUrl)
  }

  console.log(`Found ${allUrls.size} unique artwork URLs`)

  // Build url → local relative path map
  const urlMap = new Map()
  for (const url of allUrls) {
    urlMap.set(url, urlToLocalPath(url))
  }

  // Download + convert, skipping already done
  const toDownload = [...allUrls].filter(url => {
    const dest = path.join(PUBLIC_ARTWORK, urlMap.get(url))
    return !fs.existsSync(dest)
  })

  if (toDownload.length === 0) {
    console.log('All images already downloaded, skipping fetch step.')
  } else {
    console.log(`Downloading and converting ${toDownload.length} images (${allUrls.size - toDownload.length} already exist)...`)
    const tasks = toDownload.map(url => async () => {
      const dest = path.join(PUBLIC_ARTWORK, urlMap.get(url))
      await downloadAndConvert(url, dest)
    })
    await runPool(tasks, CONCURRENCY)
  }

  // Update pokemon.json
  console.log('Updating pokemon.json with local paths...')
  for (const p of pokemon) {
    if (p.officialUrl && urlMap.has(p.officialUrl))
      p.officialUrl = localPathToPublicUrl(urlMap.get(p.officialUrl))
    if (p.shiny?.officialUrl && urlMap.has(p.shiny.officialUrl))
      p.shiny.officialUrl = localPathToPublicUrl(urlMap.get(p.shiny.officialUrl))
    if (p.female?.officialUrl && urlMap.has(p.female.officialUrl))
      p.female.officialUrl = localPathToPublicUrl(urlMap.get(p.female.officialUrl))
    if (p.gigantamax?.officialUrl && urlMap.has(p.gigantamax.officialUrl))
      p.gigantamax.officialUrl = localPathToPublicUrl(urlMap.get(p.gigantamax.officialUrl))
  }

  fs.writeFileSync(POKEMON_JSON, JSON.stringify(pokemon, null, 2))
  console.log('Done! pokemon.json updated.')
  console.log(`Images saved to public/artwork/ — add to .gitignore if not committing them.`)
}

main().catch(err => { console.error(err); process.exit(1) })
