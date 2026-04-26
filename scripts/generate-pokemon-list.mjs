import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const root = join(__dirname, '..')

const LIST_FIELDS = new Set([
  'attack',
  'blurDataURL',
  'defense',
  'description',
  'generation',
  'hp',
  'id',
  'imageUrl',
  'isBaby',
  'isLegendary',
  'isMythical',
  'name',
  'officialUrl',
  'shiny',
  'specialAttack',
  'specialDefense',
  'speed',
  'types',
  // variant-only fields
  'variantIndex',
  'variantOf',
  'variantSlug',
  'variantType'
])

const fullPath = join(root, 'src/data/pokemon.json')
const listPath = join(root, 'src/data/pokemon-list.json')

const full = JSON.parse(readFileSync(fullPath, 'utf-8'))
const list = full.map(entry => {
  const slim = {}
  for (const key of LIST_FIELDS) {
    if (key in entry) slim[key] = entry[key]
  }
  return slim
})

writeFileSync(listPath, JSON.stringify(list))

const fullSize = (readFileSync(fullPath).length / 1024 / 1024).toFixed(1)
const listSize = (readFileSync(listPath).length / 1024 / 1024).toFixed(1)
console.log(`Generated pokemon-list.json: ${listSize}MB (down from ${fullSize}MB full JSON)`)
