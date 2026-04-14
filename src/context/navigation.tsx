'use client'

import { createContext, useContext } from 'react'

type NavContextValue = {
  onNext: () => void
  onPrev: () => void
}

const NavContext = createContext<NavContextValue | null>(null)

export function NavProvider({
  children,
  onNext,
  onPrev
}: {
  children: React.ReactNode
  onNext: () => void
  onPrev: () => void
}) {
  return <NavContext.Provider value={{ onNext, onPrev }}>{children}</NavContext.Provider>
}

export function useNavContext() {
  const ctx = useContext(NavContext)
  if (!ctx) throw new Error('useNavContext must be used within NavProvider')
  return ctx
}
