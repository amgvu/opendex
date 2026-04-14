'use client'

import { createContext, type ReactNode, useContext, useState } from 'react'

type CardContextValue = {
  activeTab: 'battle' | 'bio' | 'moves' | 'stats'
  gifEnabled: boolean
  setActiveTab: (tab: 'battle' | 'bio' | 'moves' | 'stats') => void
  setGifEnabled: (v: boolean) => void
}

const CardContext = createContext<CardContextValue | null>(null)

export function CardProvider({ children }: { children: ReactNode }) {
  const [gifEnabled, setGifEnabled] = useState(false)
  const [activeTab, setActiveTab] = useState<'battle' | 'bio' | 'moves' | 'stats'>('stats')
  return (
    <CardContext value={{ activeTab, gifEnabled, setActiveTab, setGifEnabled }}>
      {children}
    </CardContext>
  )
}

export function useCardContext() {
  const ctx = useContext(CardContext)
  if (!ctx) throw new Error('useCardContext must be used within CardProvider')
  return ctx
}
