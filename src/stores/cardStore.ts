import { create } from 'zustand'

type CardStore = {
  activeTab: 'bio' | 'evo' | 'moves' | 'stats'
  artworkCollapsed: boolean
  gifEnabled: boolean
  gmaxEnabled: boolean
  setActiveTab: (tab: 'bio' | 'evo' | 'moves' | 'stats') => void
  setArtworkCollapsed: (v: boolean) => void
  setGifEnabled: (v: boolean) => void
  setGmaxEnabled: (v: boolean) => void
  setShinyEnabled: (v: boolean) => void
  shinyEnabled: boolean
}

export const useCardStore = create<CardStore>(set => ({
  activeTab: 'stats',
  artworkCollapsed: false,
  gifEnabled: false,
  gmaxEnabled: false,
  setActiveTab: tab => set({ activeTab: tab }),
  setArtworkCollapsed: v => set({ artworkCollapsed: v }),
  setGifEnabled: v => set({ gifEnabled: v }),
  setGmaxEnabled: v => set({ gmaxEnabled: v }),
  setShinyEnabled: v => set({ shinyEnabled: v }),
  shinyEnabled: false
}))
