export type SortField =
  | 'attack'
  | 'defense'
  | 'generation'
  | 'hp'
  | 'id'
  | 'name'
  | 'specialAttack'
  | 'specialDefense'
  | 'speed'

export type SortOrder = 'asc' | 'desc'

export const SORT_FIELDS: { field: SortField; label: string }[] = [
  { field: 'id', label: 'ID' },
  { field: 'name', label: 'Name' },
  { field: 'generation', label: 'Gen' },
  { field: 'hp', label: 'HP' },
  { field: 'attack', label: 'ATK' },
  { field: 'defense', label: 'DEF' },
  { field: 'specialAttack', label: 'SP.ATK' },
  { field: 'specialDefense', label: 'SP.DEF' },
  { field: 'speed', label: 'SPD' }
]
