import { create } from 'zustand'

type SelectionStore = {
  fromUrl: boolean
  selectedName: null | string
  setSelectedName: (name: null | string) => void
  setSelectedNameFromUrl: (name: null | string) => void
}

export const useSelectionStore = create<SelectionStore>(set => ({
  fromUrl: false,
  selectedName: null,
  setSelectedName: name => set({ fromUrl: false, selectedName: name }),
  setSelectedNameFromUrl: name => set({ fromUrl: name !== null, selectedName: name })
}))
