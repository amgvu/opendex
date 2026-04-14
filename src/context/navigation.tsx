'use client'

import { createContext, useContext, useMemo } from 'react'

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
  const value = useMemo(() => ({ onNext, onPrev }), [onNext, onPrev])
  return <NavContext.Provider value={value}>{children}</NavContext.Provider>
}

export function useNavContext() {
  const ctx = useContext(NavContext)
  if (!ctx) throw new Error('useNavContext must be used within NavProvider')
  return ctx
}
