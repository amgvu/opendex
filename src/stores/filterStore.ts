import { create } from 'zustand'

import type { SortField, SortOrder } from '@/types/sort'

type FilterStore = {
  debouncedSearch: string
  search: string
  selectedGens: number[]
  selectedTypes: string[]
  setDebouncedSearch: (v: string) => void
  setSearch: (v: string) => void
  setSelectedGens: (v: number[]) => void
  setSelectedTypes: (v: string[]) => void
  setSortBy: (v: SortField) => void
  setSortOrder: (v: SortOrder) => void
  sortBy: SortField
  sortOrder: SortOrder
  toggleGen: (gen: number) => void
  toggleType: (type: string) => void
  updateSort: (field: SortField) => void
}

export const useFilterStore = create<FilterStore>((set, get) => ({
  debouncedSearch: '',
  search: '',
  selectedGens: [],
  selectedTypes: [],
  setDebouncedSearch: v => set({ debouncedSearch: v }),
  setSearch: v => set({ search: v }),
  setSelectedGens: v => set({ selectedGens: v }),
  setSelectedTypes: v => set({ selectedTypes: v }),
  setSortBy: v => set({ sortBy: v }),
  setSortOrder: v => set({ sortOrder: v }),
  sortBy: 'id',
  sortOrder: 'asc',
  toggleGen: gen => {
    const { selectedGens } = get()
    set({
      selectedGens: selectedGens.includes(gen)
        ? selectedGens.filter(g => g !== gen)
        : [...selectedGens, gen]
    })
  },
  toggleType: type => {
    const { selectedTypes } = get()
    set({
      selectedTypes: selectedTypes.includes(type)
        ? selectedTypes.filter(t => t !== type)
        : [...selectedTypes, type]
    })
  },
  updateSort: field => {
    const { sortBy, sortOrder } = get()
    const newOrder: SortOrder = sortBy === field && sortOrder === 'asc' ? 'desc' : 'asc'
    set({ sortBy: field, sortOrder: newOrder })
  }
}))
