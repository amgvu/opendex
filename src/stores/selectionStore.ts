import { create } from 'zustand'

type SelectionStore = {
  fromUrl: boolean
  mode: 'flip' | 'slide'
  navigateTo: (name: string, direction: 'left' | 'right') => void
  selectedName: null | string
  setSelectedName: (name: null | string) => void
  setSelectedNameFromUrl: (name: null | string) => void
  slideDirection: 'left' | 'right' | null
}

export const useSelectionStore = create<SelectionStore>(set => ({
  fromUrl: false,
  mode: 'flip',
  navigateTo: (name, direction) => set({ mode: 'slide', selectedName: name, slideDirection: direction }),
  selectedName: null,
  setSelectedName: name => set({ fromUrl: false, mode: 'flip', selectedName: name, slideDirection: null }),
  setSelectedNameFromUrl: name => set({ fromUrl: name !== null, mode: name ? 'slide' : 'flip', selectedName: name, slideDirection: null }),
  slideDirection: null
}))
