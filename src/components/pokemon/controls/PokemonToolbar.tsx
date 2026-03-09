'use client'

import { TbAdjustments } from 'react-icons/tb'

import type { SortField, SortOrder } from '@/types/sort'

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '../../ui/drawer'
import { Input } from '../../ui/input'
import { FilterControls } from './FilterControls'
import { SortControls } from './SortControls'

export function PokemonToolbar({
  onToggleGen,
  onToggleType,
  onUpdateSearch,
  onUpdateSort,
  search,
  selectedGens,
  selectedTypes,
  sortBy,
  sortOrder
}: {
  onToggleGen: (gen: number) => void
  onToggleType: (type: string) => void
  onUpdateSearch: (value: string) => void
  onUpdateSort: (field: SortField) => void
  search: string
  selectedGens: number[]
  selectedTypes: string[]
  sortBy: SortField
  sortOrder: SortOrder
}) {
  const activeCount =
    selectedTypes.length +
    selectedGens.length +
    (sortBy !== 'id' || sortOrder !== 'asc' ? 1 : 0)

  return (
    <div className="mb-4 space-y-3">
      {/* Search + mobile drawer trigger */}
      <div className="flex gap-2">
        <Input
          className="flex-1"
          onChange={e => onUpdateSearch(e.target.value)}
          placeholder="Search Pokemon..."
          type="text"
          value={search}
        />
        <Drawer>
          <DrawerTrigger className="relative inline-flex cursor-pointer items-center gap-2 rounded-md border bg-background px-3 text-sm font-medium shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground lg:hidden">
            <TbAdjustments size={16} />
            {activeCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-foreground text-[10px] font-bold text-background">
                {activeCount}
              </span>
            )}
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Sort &amp; Filter</DrawerTitle>
            </DrawerHeader>
            <div className="space-y-4 p-4 pt-0">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">
                  Sort
                </p>
                <SortControls
                  onSort={onUpdateSort}
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                />
              </div>
              <div>
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
            </div>
          </DrawerContent>
        </Drawer>
      </div>

      {/* Desktop static controls */}
      <div className="hidden flex-wrap items-center gap-3 lg:flex">
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
