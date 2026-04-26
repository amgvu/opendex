import { create } from 'zustand'

type SelectionStore = {
  fromUrl: boolean
  mode: 'flip' | 'slide'
  selectedName: null | string
  slideDirection: 'left' | 'right' | null
  navigateTo: (name: string, direction: 'left' | 'right') => void
  setSelectedName: (name: null | string) => void
  setSelectedNameFromUrl: (name: null | string) => void
}

export const useSelectionStore = create<SelectionStore>(set => ({
  fromUrl: false,
  mode: 'flip',
  selectedName: null,
  slideDirection: null,
  navigateTo: (name, direction) => set({ mode: 'slide', selectedName: name, slideDirection: direction }),
  setSelectedName: name => set({ fromUrl: false, mode: 'flip', selectedName: name, slideDirection: null }),
  setSelectedNameFromUrl: name => set({ fromUrl: name !== null, mode: name ? 'slide' : 'flip', selectedName: name, slideDirection: null })
}))
