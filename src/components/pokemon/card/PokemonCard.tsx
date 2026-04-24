'use client'

import { LayoutGroup } from 'motion/react'
import { memo, useCallback, useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import type { PokemonEntry } from '@/lib/types'

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
    const [showPortal, setShowPortal] = useState(false)
    const activeRef = useRef(active)
    activeRef.current = active

    useEffect(() => {
      if (active) setShowPortal(true)
    }, [active])

    const handleExitComplete = useCallback(() => {
      if (!activeRef.current) setShowPortal(false)
    }, [])

    useOutsideClick(ref, onClose, active)
    useBodyScrollLock(active, onClose)

    return (
      <LayoutGroup id={`pokemon-${pokemon.name}`}>
        {showPortal && createPortal(
          <ExpandedCard
            active={active}
            id={id}
            onExitComplete={handleExitComplete}
            pokemon={detail ?? pokemon}
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
