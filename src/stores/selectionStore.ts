import { create } from 'zustand'

type SelectionStore = {
  fromUrl: boolean
  selectedId: null | number
  selectedVariantIndex: null | number
  setSelectedId: (id: null | number, variantIndex?: null | number) => void
  setSelectedIdFromUrl: (id: null | number, variantIndex?: null | number) => void
}

export const useSelectionStore = create<SelectionStore>(set => ({
  fromUrl: false,
  selectedId: null,
  selectedVariantIndex: null,
  setSelectedId: (id, variantIndex = null) =>
    set({ fromUrl: false, selectedId: id, selectedVariantIndex: id !== null ? variantIndex : null }),
  setSelectedIdFromUrl: (id, variantIndex = null) =>
    set({ fromUrl: id !== null, selectedId: id, selectedVariantIndex: id !== null ? variantIndex : null })
}))
