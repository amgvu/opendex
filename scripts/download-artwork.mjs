import fs from 'fs'
import path from 'path'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const PUBLIC_ARTWORK = path.join(ROOT, 'public', 'artwork')
const POKEMON_JSON = path.join(ROOT, 'src', 'data', 'pokemon.json')

const CONCURRENCY = 20
const BASE =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/'

async function downloadAndConvert(remoteUrl, destAbs, retries = 3) {
  fs.mkdirSync(path.dirname(destAbs), { recursive: true })
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(remoteUrl)
      if (!res.ok) throw new Error(`HTTP ${res.status} for ${remoteUrl}`)
      const buf = Buffer.from(await res.arrayBuffer())
      await sharp(buf).webp({ quality: 90 }).toFile(destAbs)
      return
    } catch (err) {
      if (attempt === retries) throw err
      await new Promise(r => setTimeout(r, 500 * attempt))
    }
  }
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
    console.log(
      `Downloading and converting ${toDownload.length} images (${entries.size - toDownload.length} already exist)...`
    )
    const tasks = toDownload.map(([localRelative, remoteUrl]) => async () => {
      await downloadAndConvert(
        remoteUrl,
        path.join(PUBLIC_ARTWORK, localRelative)
      )
    })
    await runPool(tasks, CONCURRENCY)
  }

  const PUBLIC_THUMBS = path.join(PUBLIC_ARTWORK, 'thumbs')
  const allLocal = [...entries.keys()]
  const toThumb = allLocal.filter(localRelative => {
    const thumbPath = path.join(PUBLIC_THUMBS, localRelative)
    return !fs.existsSync(thumbPath)
  })

  if (toThumb.length === 0) {
    console.log('All thumbnails already present, skipping.')
  } else {
    console.log(`Generating ${toThumb.length} thumbnails...`)
    const thumbTasks = toThumb.map(localRelative => async () => {
      const srcPath = path.join(PUBLIC_ARTWORK, localRelative)
      const destPath = path.join(PUBLIC_THUMBS, localRelative)
      fs.mkdirSync(path.dirname(destPath), { recursive: true })
      await sharp(srcPath).resize(256).webp({ quality: 80 }).toFile(destPath)
    })
    await runPool(thumbTasks, CONCURRENCY)
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

async function runPool(tasks, concurrency) {
  let i = 0
  let done = 0
  const total = tasks.length
  async function worker() {
    while (i < tasks.length) {
      const task = tasks[i++]
      await task()
      done++
      if (done % 50 === 0 || done === total)
        process.stdout.write(`\r  ${done}/${total}`)
    }
  }
  await Promise.all(Array.from({ length: concurrency }, worker))
  console.log()
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
