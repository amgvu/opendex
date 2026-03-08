export type SortField =
  | 'id'
  | 'name'
  | 'type'
  | 'hp'
  | 'attack'
  | 'defense'
  | 'specialAttack'
  | 'specialDefense'
  | 'speed'

export type SortOrder = 'asc' | 'desc'

export const SORT_FIELDS: { field: SortField; label: string }[] = [
  { field: 'id', label: 'ID' },
  { field: 'name', label: 'Name' },
  { field: 'type', label: 'Type' },
  { field: 'hp', label: 'HP' },
  { field: 'attack', label: 'ATK' },
  { field: 'defense', label: 'DEF' },
  { field: 'specialAttack', label: 'SP.ATK' },
  { field: 'specialDefense', label: 'SP.DEF' },
  { field: 'speed', label: 'SPD' }
]
