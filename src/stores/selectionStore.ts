import { create } from 'zustand'

type SelectionStore = {
  fromUrl: boolean
  selectedId: null | number
  setSelectedId: (id: null | number) => void
  setSelectedIdFromUrl: (id: null | number) => void
}

export const useSelectionStore = create<SelectionStore>(set => ({
  fromUrl: false,
  selectedId: null,
  setSelectedId: id => set({ fromUrl: false, selectedId: id }),
  setSelectedIdFromUrl: id => set({ fromUrl: id !== null, selectedId: id })
}))
