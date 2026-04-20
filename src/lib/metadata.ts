import type { SortField, SortOrder } from '@/types/sort'

import { SORT_FIELDS } from '@/types/sort'
import { capitalize, SITE_NAME } from '@/lib/pokemon'

const SORT_LABELS: Record<SortField, string> = {
  attack: 'Attack',
  bst: 'BST',
  defense: 'Defense',
  generation: 'Generation',
  hp: 'HP',
  id: 'ID',
  name: 'Name',
  specialAttack: 'Sp. Atk',
  specialDefense: 'Sp. Def',
  speed: 'Speed'
}

const VALID_SORT_FIELDS = new Set(SORT_FIELDS.map(f => f.field))

export function buildFilterMetadata(
  types: string[],
  gens: number[],
  sortBy: string,
  sortOrder: string
): { description: string; title: string } | null {
  const validSortBy = VALID_SORT_FIELDS.has(sortBy as SortField)
    ? (sortBy as SortField)
    : 'id'
  const validSortOrder: SortOrder = sortOrder === 'desc' ? 'desc' : 'asc'
  const isDefaultSort = validSortBy === 'id' && validSortOrder === 'asc'

  if (types.length === 0 && gens.length === 0 && isDefaultSort) return null

  let subject = ''
  if (gens.length > 0) subject += `Gen ${gens.join(' & ')} `
  if (types.length > 0) subject += `${types.map(capitalize).join(' · ')} `
  subject += 'Pokémon'

  let sortSuffix = ''
  if (!isDefaultSort) {
    const label = SORT_LABELS[validSortBy]
    const dir =
      validSortBy === 'name'
        ? validSortOrder === 'asc'
          ? 'A–Z'
          : 'Z–A'
        : validSortOrder === 'asc'
          ? 'Low–High'
          : 'High–Low'
    sortSuffix = ` by ${label} (${dir})`
  }

  const title = `${subject}${sortSuffix} — ${SITE_NAME}`
  const description = `Browse ${subject.toLowerCase()}${sortSuffix} on ${SITE_NAME}.`

  return { description, title }
}
