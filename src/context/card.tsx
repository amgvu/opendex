'use client'

import { createContext, type ReactNode, useContext, useMemo, useState } from 'react'

type CardContextValue = {
  activeTab: 'battle' | 'bio' | 'evo' | 'moves' | 'stats'
  gifEnabled: boolean
  setActiveTab: (tab: 'battle' | 'bio' | 'evo' | 'moves' | 'stats') => void
  setGifEnabled: (v: boolean) => void
  setStatsView: (v: 'bars' | 'radar') => void
  statsView: 'bars' | 'radar'
}

const CardContext = createContext<CardContextValue | null>(null)

export function CardProvider({ children }: { children: ReactNode }) {
  const [gifEnabled, setGifEnabled] = useState(false)
  const [activeTab, setActiveTab] = useState<'battle' | 'bio' | 'evo' | 'moves' | 'stats'>('stats')
  const [statsView, setStatsView] = useState<'bars' | 'radar'>('bars')

  const value = useMemo(
    () => ({ activeTab, gifEnabled, setActiveTab, setGifEnabled, setStatsView, statsView }),
    [activeTab, gifEnabled, setActiveTab, setGifEnabled, setStatsView, statsView]
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
