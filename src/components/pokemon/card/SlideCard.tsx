'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import type { PokemonEntry, PokemonListEntry } from '@/lib/types'

import { useBodyScrollLock } from '@/hooks/card/useBodyScrollLock'
import { useOutsideClick } from '@/hooks/card/useOutsideClick'
import { useSelectionStore } from '@/stores/selectionStore'

import { ExpandedCard } from './expanded'

type SlideDirection = 'left' | 'right' | null

const slideVariants = {
  enter: (dir: SlideDirection) => ({
    opacity: dir === null ? 0 : 1,
    x: dir === 'left' ? '100%' : dir === 'right' ? '-100%' : 0
  }),
  center: { opacity: 1, x: 0 },
  exit: (dir: SlideDirection) => ({
    opacity: dir === null ? 0 : 0.85,
    scale: dir === null ? 0.95 : 1,
    x: dir === 'left' ? '-55%' : dir === 'right' ? '55%' : 0
  })
}

export function SlideCard({
  active,
  detail,
  pokemon
}: {
  active: boolean
  detail: PokemonEntry | undefined
  pokemon: PokemonListEntry
}) {
  const ref = useRef<HTMLDivElement>(null)
  const slideDirection = useSelectionStore(s => s.slideDirection)
  const setSelectedName = useSelectionStore(s => s.setSelectedName)
  const [show, setShow] = useState(active)
  const activeRef = useRef(active)
  activeRef.current = active

  useEffect(() => {
    if (active) setShow(true)
  }, [active])

  const onClose = useCallback(() => setSelectedName(null), [setSelectedName])
  const handleExitComplete = useCallback(() => {
    if (!activeRef.current) setShow(false)
  }, [])

  useOutsideClick(ref, onClose, active)
  useBodyScrollLock(active, onClose)

  if (!show) return null

  return createPortal(
    <AnimatePresence custom={slideDirection} onExitComplete={handleExitComplete}>
      {active && (
        <motion.div
          key={pokemon.name}
          animate="center"
          className="fixed inset-0 z-50"
          custom={slideDirection}
          exit="exit"
          initial="enter"
          transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
          variants={slideVariants}
        >
          <ExpandedCard
            active
            detail={detail}
            disableFlip
            id="__slide__"
            onExitComplete={() => {}}
            pokemon={pokemon}
            ref={ref}
          />
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}
