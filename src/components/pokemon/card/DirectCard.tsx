'use client'

import { useRef } from 'react'
import { createPortal } from 'react-dom'

import type { PokemonListEntry } from '@/lib/types'

import { useBodyScrollLock } from '@/hooks/card/useBodyScrollLock'
import { useOutsideClick } from '@/hooks/card/useOutsideClick'
import { usePokemonByNameQuery } from '@/hooks/query/usePokemonByNameQuery'
import { useSelectionStore } from '@/stores/selectionStore'

import { ExpandedCard } from './expanded'

export function DirectCard({ pokemon }: { pokemon: PokemonListEntry }) {
  const ref = useRef<HTMLDivElement>(null)
  const setSelectedName = useSelectionStore(s => s.setSelectedName)
  const onClose = () => setSelectedName(null)
  useOutsideClick(ref, onClose, true)
  useBodyScrollLock(true, onClose)
  const { pokemon: detail } = usePokemonByNameQuery(pokemon.name)
  return createPortal(
    <ExpandedCard active detail={detail ?? undefined} id="__direct__" onExitComplete={() => {}} pokemon={pokemon} ref={ref} />,
    document.body
  )
}
