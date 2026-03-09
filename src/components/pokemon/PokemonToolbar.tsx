'use client'

import { motion } from 'motion/react'
import { useState } from 'react'
import { TbAdjustments } from 'react-icons/tb'

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
  const [drawerOpen, setDrawerOpen] = useState(false)

  const activeCount =
    selectedTypes.length +
    selectedGens.length +
    (sortBy !== 'id' || sortOrder !== 'asc' ? 1 : 0)

  return (
    <>
      <Input
        className="mb-4"
        onChange={e => onUpdateSearch(e.target.value)}
        placeholder="Search Pokemon..."
        type="text"
        value={search}
      />

      <button
        className="mb-4 flex cursor-pointer items-center gap-2 rounded-lg bg-muted px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted/70"
        onClick={() => setDrawerOpen(o => !o)}
      >
        <TbAdjustments size={14} />
        Sort &amp; Filter
        <span
          className={`rounded-full bg-foreground px-1.5 py-0.5 text-xs text-background transition-opacity ${activeCount > 0 ? 'opacity-100' : 'opacity-0'}`}
        >
          {activeCount}
        </span>
      </button>

      <motion.div
        animate={{ height: drawerOpen ? 'auto' : 0, opacity: drawerOpen ? 1 : 0 }}
        className="overflow-hidden"
        initial={false}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
      >
        <div>
          <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">
            Sort
          </p>
          <SortControls
            onSort={onUpdateSort}
            sortBy={sortBy}
            sortOrder={sortOrder}
          />
          <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">
            Filter
          </p>
          <FilterControls
            onToggleGen={onToggleGen}
            onToggleType={onToggleType}
            selectedGens={selectedGens}
            selectedTypes={selectedTypes}
          />
        </div>
      </motion.div>
    </>
  )
}
