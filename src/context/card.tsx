'use client'

import { createContext, type ReactNode, useContext, useMemo, useState } from 'react'

type CardContextValue = {
  activeTab: 'battle' | 'bio' | 'evo' | 'moves' | 'stats'
  artworkCollapsed: boolean
  gifEnabled: boolean
  setActiveTab: (tab: 'battle' | 'bio' | 'evo' | 'moves' | 'stats') => void
  setArtworkCollapsed: (v: boolean) => void
  setGifEnabled: (v: boolean) => void
  setShinyEnabled: (v: boolean) => void
  setStatsView: (v: 'bars' | 'radar') => void
  shinyEnabled: boolean
  statsView: 'bars' | 'radar'
}

const CardContext = createContext<CardContextValue | null>(null)

export function CardProvider({ children }: { children: ReactNode }) {
  const [gifEnabled, setGifEnabled] = useState(false)
  const [shinyEnabled, setShinyEnabled] = useState(false)
  const [activeTab, setActiveTab] = useState<'battle' | 'bio' | 'evo' | 'moves' | 'stats'>('stats')
  const [statsView, setStatsView] = useState<'bars' | 'radar'>('bars')
  const [artworkCollapsed, setArtworkCollapsed] = useState(false)

  const value = useMemo(
    () => ({ activeTab, artworkCollapsed, gifEnabled, setActiveTab, setArtworkCollapsed, setGifEnabled, setShinyEnabled, setStatsView, shinyEnabled, statsView }),
    [activeTab, artworkCollapsed, gifEnabled, setActiveTab, setArtworkCollapsed, setGifEnabled, setShinyEnabled, setStatsView, shinyEnabled, statsView]
  )

  return (
    <CardContext value={value}>
      {children}
    </CardContext>
  )
}

export function useCardContext() {
  const ctx = useContext(CardContext)
  if (!ctx) throw new Error('useCardContext must be used within CardProvider')
  return ctx
}
