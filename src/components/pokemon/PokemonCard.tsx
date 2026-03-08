'use client'

import { LayoutGroup } from 'motion/react'
import { memo, useId, useRef } from 'react'
import { createPortal } from 'react-dom'

import type { Pokemon } from '@/types/pokemon'

import { useOutsideClick } from '@/hooks/use-outside-click'
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock'

import { DefaultCard } from './DefaultCard'
import { ExpandedCard } from './ExpandedCard'

export const PokemonCard = memo(function PokemonCard({
  active,
  onClick,
  onClose,
  onNext,
  onPrev,
  pokemon
}: {
  active: boolean
  onClick: () => void
  onClose: () => void
  onNext: () => void
  onPrev: () => void
  pokemon: Pokemon
}) {
  const ref = useRef<HTMLDivElement>(null)
  const id = useId()

  useOutsideClick(ref, onClose)
  useBodyScrollLock(active, onClose)

  return (
    <LayoutGroup id={`pokemon-${pokemon.id}`}>
      {createPortal(
        <ExpandedCard
          active={active}
          id={id}
          onNext={onNext}
          onPrev={onPrev}
          pokemon={pokemon}
          ref={ref}
        />,
        document.body
      )}
      <DefaultCard
        active={active}
        id={id}
        onClick={onClick}
        pokemon={pokemon}
      />
    </LayoutGroup>
  )
}, (prev, next) => prev.active === next.active && prev.pokemon === next.pokemon)
