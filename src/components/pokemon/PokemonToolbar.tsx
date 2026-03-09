'use client'

import type { SortField, SortOrder } from '@/types/sort'

import { Input } from '../ui/input'
import { FilterControls } from './FilterControls'
import { SortControls } from './SortControls'

export function PokemonToolbar({
  onToggleGen,
  onToggleType,
  onUpdateSort,
  onUpdateSearch,
  search,
  selectedGens,
  selectedTypes,
  sortBy,
  sortOrder
}: {
  onToggleGen: (gen: number) => void
  onToggleType: (type: string) => void
  onUpdateSort: (field: SortField) => void
  onUpdateSearch: (value: string) => void
  search: string
  selectedGens: number[]
  selectedTypes: string[]
  sortBy: SortField
  sortOrder: SortOrder
}) {
  return (
    <div className="mb-4 space-y-3">
      <Input
        onChange={e => onUpdateSearch(e.target.value)}
        placeholder="Search Pokemon..."
        type="text"
        value={search}
      />
      <div className="flex flex-wrap items-center gap-3">
        <SortControls
          onSort={onUpdateSort}
          sortBy={sortBy}
          sortOrder={sortOrder}
        />
        <div className="h-4 w-px bg-border" />
        <FilterControls
          onToggleGen={onToggleGen}
          onToggleType={onToggleType}
          selectedGens={selectedGens}
          selectedTypes={selectedTypes}
        />
      </div>
    </div>
  )
}
