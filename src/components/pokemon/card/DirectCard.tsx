'use client'

import { useRef } from 'react'
import { createPortal } from 'react-dom'

import type { PokemonEntry } from '@/types/pokemon'

import { useBodyScrollLock } from '@/hooks/card/useBodyScrollLock'
import { useOutsideClick } from '@/hooks/card/useOutsideClick'
import { useSelectionStore } from '@/stores/selectionStore'

import { ExpandedCard } from './expanded'

export function DirectCard({ pokemon }: { pokemon: PokemonEntry }) {
  const ref = useRef<HTMLDivElement>(null)
  const setSelectedName = useSelectionStore(s => s.setSelectedName)
  const onClose = () => setSelectedName(null)
  useOutsideClick(ref, onClose, true)
  useBodyScrollLock(true, onClose)
  return createPortal(
    <ExpandedCard active id="__direct__" pokemon={pokemon} ref={ref} />,
    document.body
  )
}
