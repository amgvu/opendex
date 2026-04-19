'use client'

import { TbAdjustments, TbHome } from 'react-icons/tb'

import { useFilterStore } from '@/stores/filterStore'

import { Button, buttonVariants } from '../../ui/button'
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

export function PokemonToolbar() {
  const search = useFilterStore(s => s.search)
  const setSearch = useFilterStore(s => s.setSearch)
  const sortBy = useFilterStore(s => s.sortBy)
  const sortOrder = useFilterStore(s => s.sortOrder)
  const selectedTypes = useFilterStore(s => s.selectedTypes)
  const selectedGens = useFilterStore(s => s.selectedGens)

  const activeCount =
    selectedTypes.length +
    selectedGens.length +
    (sortBy !== 'id' || sortOrder !== 'asc' ? 1 : 0)

  return (
    <div className="">
      {/* Search + mobile drawer trigger */}
      <div className="flex gap-2">
        <Button asChild size="icon" variant="outline">
          <a href="/">
            <TbHome size={16} />
          </a>
        </Button>
        <Input
          className="flex-1"
          onChange={e => setSearch(e.target.value)}
          placeholder="Search Pokemon..."
          type="text"
          value={search}
        />
        <Drawer shouldScaleBackground={false}>
          <DrawerTrigger
            className={`relative xl:hidden ${buttonVariants({ size: 'icon', variant: 'outline' })}`}
          >
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
                <SortControls />
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">
                  Filter
                </p>
                <FilterControls />
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      </div>

      {/* Desktop static controls */}
      <div className="hidden flex-wrap items-center gap-3 2xl:gap-4 xl:flex">
        <SortControls />
        <div className="h-4 w-px bg-border" />
        <FilterControls />
      </div>
    </div>
  )
}
