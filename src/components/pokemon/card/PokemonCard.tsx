'use client'

import { LayoutGroup } from 'motion/react'
import { memo, useId, useRef } from 'react'
import { createPortal } from 'react-dom'

import type { Pokemon } from '@/types/pokemon'

import { useBodyScrollLock } from '@/hooks/card/useBodyScrollLock'
import { useOutsideClick } from '@/hooks/card/useOutsideClick'

import { DefaultCard } from './DefaultCard'
import { ExpandedCard } from './ExpandedCard'

export const PokemonCard = memo(
  function PokemonCard({
    active,
    index,
    onClick,
    onClose,
    onNext,
    onPrev,
    pokemon
  }: {
    active: boolean
    index: number
    onClick: () => void
    onClose: () => void
    onNext: () => void
    onPrev: () => void
    pokemon: Pokemon
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
          id={id}
          index={index}
          onClick={onClick}
          pokemon={pokemon}
        />
      </LayoutGroup>
    )
  },
  (prev, next) => prev.active === next.active && prev.pokemon === next.pokemon
)
