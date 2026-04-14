import { create } from 'zustand'

type SelectionStore = {
  selectedId: number | null
  setSelectedId: (id: number | null) => void
}

export const useSelectionStore = create<SelectionStore>(set => ({
  selectedId: null,
  setSelectedId: id => set({ selectedId: id })
}))
