#!/usr/bin/env node
// Patches imageUrl and shiny.imageUrl for variant entries in pokemon.json
// to use the correct Showdown sprite naming convention.
import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dataPath = join(__dirname, '../src/data/pokemon.json')

const VARIANTS = [
  ['-mega-x', '-megax'],
  ['-mega-y', '-megay'],
  ['-mega', '-mega'],
  ['-alola', '-alola'],
  ['-galar', '-galar'],
  ['-hisui', '-hisui'],
  ['-paldea', '-paldea'],
]

function toShowdownSlug(slug) {
  for (const [apiSuffix, showdownSuffix] of VARIANTS) {
    if (slug.endsWith(apiSuffix)) {
      const base = slug.slice(0, -apiSuffix.length).replace(/-/g, '')
      return base + showdownSuffix
    }
  }
  return slug.replace(/-/g, '')
}

function fixUrl(url, slug) {
  if (!url) return url
  const correct = `https://play.pokemonshowdown.com/sprites/ani/${toShowdownSlug(slug)}.gif`
  const correctShiny = `https://play.pokemonshowdown.com/sprites/ani-shiny/${toShowdownSlug(slug)}.gif`
  if (url.includes('/ani-shiny/')) return correctShiny
  if (url.includes('/ani/')) return correct
  return url
}

const data = JSON.parse(readFileSync(dataPath, 'utf8'))
let fixed = 0

for (const p of data) {
  if (!p.variantType) continue
  const slug = p.name

  const newImageUrl = fixUrl(p.imageUrl, slug)
  if (newImageUrl !== p.imageUrl) {
    console.log(`${slug}: ${p.imageUrl} -> ${newImageUrl}`)
    p.imageUrl = newImageUrl
    fixed++
  }

  if (p.shiny?.imageUrl) {
    const newShinyUrl = fixUrl(p.shiny.imageUrl, slug)
    if (newShinyUrl !== p.shiny.imageUrl) {
      p.shiny.imageUrl = newShinyUrl
      fixed++
    }
  }
}

writeFileSync(dataPath, JSON.stringify(data, null, 2))
console.log(`\nFixed ${fixed} URLs`)
