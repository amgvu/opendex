'use client'

import { LayoutGroup } from 'motion/react'
import { memo, useId, useRef } from 'react'
import { createPortal } from 'react-dom'

import type { PokemonEntry } from '@/types/pokemon'

import { useBodyScrollLock } from '@/hooks/card/useBodyScrollLock'
import { useOutsideClick } from '@/hooks/card/useOutsideClick'
import { usePokemonByNameQuery } from '@/hooks/query/usePokemonByNameQuery'
import { useSelectionStore } from '@/stores/selectionStore'

import { DefaultCard } from './default/DefaultCard'
import { ExpandedCard } from './expanded'

export const PokemonCard = memo(
  function PokemonCard({
    active,
    index,
    onClick,
    pokemon
  }: {
    active: boolean
    index: number
    onClick: () => void
    pokemon: PokemonEntry
  }) {
    const ref = useRef<HTMLDivElement>(null)
    const id = useId()
    const setSelectedName = useSelectionStore(s => s.setSelectedName)
    const onClose = () => setSelectedName(null)
    const { pokemon: detail } = usePokemonByNameQuery(active ? pokemon.name : null)

    useOutsideClick(ref, onClose, active)
    useBodyScrollLock(active, onClose)

    return (
      <LayoutGroup id={`pokemon-${pokemon.name}`}>
        {createPortal(
          <ExpandedCard active={active} id={id} pokemon={detail ?? pokemon} ref={ref} />,
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
