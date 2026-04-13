'use client'

import { useRef } from 'react'
import { createPortal } from 'react-dom'

import type { Pokemon } from '@/types/pokemon'

import { useBodyScrollLock } from '@/hooks/card/useBodyScrollLock'
import { useOutsideClick } from '@/hooks/card/useOutsideClick'

import { ExpandedCard } from './expanded'

export function DirectCard({
  onClose,
  onNext,
  onPrev,
  pokemon
}: {
  onClose: () => void
  onNext: () => void
  onPrev: () => void
  pokemon: Pokemon
}) {
  const ref = useRef<HTMLDivElement>(null)
  useOutsideClick(ref, onClose, true)
  useBodyScrollLock(true, onClose)
  return createPortal(
    <ExpandedCard
      active
      id="__direct__"
      onNext={onNext}
      onPrev={onPrev}
      pokemon={pokemon}
      ref={ref}
    />,
    document.body
  )
}
