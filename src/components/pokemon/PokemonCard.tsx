'use client'

import { useId, useRef } from 'react'
import { createPortal } from 'react-dom'

import type { Pokemon } from '@/types/pokemon'

import { useOutsideClick } from '@/hooks/use-outside-click'
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock'

import { DefaultCard } from './DefaultCard'
import { ExpandedCard } from './ExpandedCard'

export function PokemonCard({
  active,
  onClick,
  onClose,
  pokemon
}: {
  active: boolean
  onClick: () => void
  onClose: () => void
  pokemon: Pokemon
}) {
  const ref = useRef<HTMLDivElement>(null)
  const id = useId()

  useOutsideClick(ref, onClose)
  useBodyScrollLock(active, onClose)

  return (
    <>
      {createPortal(
        <ExpandedCard active={active} id={id} pokemon={pokemon} ref={ref} />,
        document.body
      )}
      <DefaultCard
        active={active}
        id={id}
        onClick={onClick}
        pokemon={pokemon}
      />
    </>
  )
}
