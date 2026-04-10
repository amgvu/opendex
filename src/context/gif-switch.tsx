'use client'

import { createContext, type ReactNode, useContext, useState } from 'react'

type GifSwitchContextValue = {
  gifEnabled: boolean
  setGifEnabled: (v: boolean) => void
}

const GifSwitchContext = createContext<GifSwitchContextValue | null>(null)

export function GifSwitchProvider({ children }: { children: ReactNode }) {
  const [gifEnabled, setGifEnabled] = useState(false)
  return (
    <GifSwitchContext value={{ gifEnabled, setGifEnabled }}>
      {children}
    </GifSwitchContext>
  )
}

export function useGifSwitch() {
  const ctx = useContext(GifSwitchContext)
  if (!ctx) throw new Error('useGifSwitch must be used within GifSwitchProvider')
  return ctx
}
