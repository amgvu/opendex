'use client'

import { LayoutGroup } from 'motion/react'
import { memo, useId, useRef } from 'react'
import { createPortal } from 'react-dom'

import type { Pokemon } from '@/types/pokemon'

import { useBodyScrollLock } from '@/hooks/useBodyScrollLock'
import { useOutsideClick } from '@/hooks/useOutsideClick'

import { DefaultCard } from './DefaultCard'
import { ExpandedCard } from './ExpandedCard'

export const PokemonCard = memo(
  function PokemonCard({
    active,
    eager = false,
    onClick,
    onClose,
    onNext,
    onPrev,
    pokemon,
    priority = false
  }: {
    active: boolean
    eager?: boolean
    onClick: () => void
    onClose: () => void
    onNext: () => void
    onPrev: () => void
    pokemon: Pokemon
    priority?: boolean
  }) {
    const ref = useRef<HTMLDivElement>(null)
    const id = useId()

    useOutsideClick(ref, onClose, active)
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
          eager={eager}
          id={id}
          onClick={onClick}
          pokemon={pokemon}
          priority={priority}
        />
      </LayoutGroup>
    )
  },
  (prev, next) => prev.active === next.active && prev.pokemon === next.pokemon
)
