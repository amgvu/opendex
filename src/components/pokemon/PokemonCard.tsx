'use client'

import { AnimatePresence, motion } from 'motion/react'
import Image from 'next/image'
import { useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'

import type { Pokemon } from '@/types/pokemon'

import { useOutsideClick } from '@/hooks/use-outside-click'
import { getTypeColor } from '@/lib/pokemon'

const STAT_MAX = 255

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
  const typeColor = getTypeColor(pokemon.types[0] ?? '')

  useOutsideClick(ref, onClose)

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    if (active) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
      document.body.style.overflow = 'hidden'
      document.body.style.paddingRight = `${scrollbarWidth}px`
      window.addEventListener('keydown', onKeyDown)
    } else {
      document.body.style.overflow = 'auto'
      document.body.style.paddingRight = ''
    }
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [active, onClose])

  return (
    <>
      {createPortal(
        <AnimatePresence>
          {active && (
            <>
              <motion.div
                animate={{ opacity: 1 }}
                className="fixed inset-0 z-40 bg-black/40"
                exit={{ opacity: 0 }}
                initial={{ opacity: 0 }}
              />
              <div className="fixed inset-0 z-50 grid place-items-center p-4">
                <motion.div
                  className={`relative w-full max-w-md overflow-hidden rounded-2xl shadow-2xl ${typeColor}`}
                  layoutId={`card-${pokemon.id}-${id}`}
                  ref={ref}
                  transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
                >
                  <div className="absolute inset-0 bg-black/30" />
                  <div className="relative p-6">
                    <div className="mb-4 flex items-start justify-between">
                      <div>
                        <motion.h2
                          className="text-2xl font-bold capitalize text-white"
                          layoutId={`name-${pokemon.id}-${id}`}
                          transition={{
                            duration: 0.25,
                            ease: [0.32, 0.72, 0, 1]
                          }}
                        >
                          {pokemon.name}
                        </motion.h2>
                        <span className="text-sm text-white/60">
                          #{pokemon.id}
                        </span>
                      </div>
                      <motion.div
                        className="flex flex-wrap gap-1"
                        layoutId={`types-${pokemon.id}-${id}`}
                        transition={{
                          duration: 0.25,
                          ease: [0.32, 0.72, 0, 1]
                        }}
                      >
                        {pokemon.types.map(type => (
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs font-medium text-white ${getTypeColor(type)}`}
                            key={type}
                          >
                            {type}
                          </span>
                        ))}
                        {pokemon.isLegendary && (
                          <span className="rounded-full bg-yellow-400 px-2 py-0.5 text-xs font-medium text-black">
                            Legendary
                          </span>
                        )}
                      </motion.div>
                    </div>

                    {pokemon.imageUrl && (
                      <motion.div
                        animate={{ opacity: 1 }}
                        className="mb-4 flex justify-center"
                        exit={{ opacity: 0 }}
                        initial={{ opacity: 0 }}
                      >
                        <Image
                          alt={pokemon.name}
                          className="h-40 w-40 object-contain drop-shadow-lg"
                          height={160}
                          src={pokemon.imageUrl}
                          width={160}
                        />
                      </motion.div>
                    )}

                    <motion.p
                      animate={{ opacity: 1 }}
                      className="mb-4 text-sm text-white/70"
                      exit={{ opacity: 0 }}
                      initial={{ opacity: 0 }}
                    >
                      {pokemon.description}
                    </motion.p>

                    <motion.div
                      animate={{ opacity: 1 }}
                      className="flex flex-col gap-2"
                      exit={{ opacity: 0 }}
                      initial={{ opacity: 0 }}
                    >
                      <StatBar label="HP" value={pokemon.hp} />
                      <StatBar label="Attack" value={pokemon.attack} />
                      <StatBar label="Defense" value={pokemon.defense} />
                      <StatBar
                        label="Sp. Attack"
                        value={pokemon.specialAttack}
                      />
                      <StatBar
                        label="Sp. Defense"
                        value={pokemon.specialDefense}
                      />
                      <StatBar label="Speed" value={pokemon.speed} />
                    </motion.div>

                    <motion.div
                      animate={{ opacity: 1 }}
                      className="mt-4 grid grid-cols-3 gap-2 text-sm"
                      exit={{ opacity: 0 }}
                      initial={{ opacity: 0 }}
                    >
                      <div className="flex flex-col">
                        <span className="text-white/60">Height</span>
                        <span className="font-medium text-white">
                          {pokemon.height.toFixed(1)}m
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-white/60">Weight</span>
                        <span className="font-medium text-white">
                          {pokemon.weight.toFixed(1)} lbs
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-white/60">Gen</span>
                        <span className="font-medium text-white">
                          {pokemon.generation}
                        </span>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}

      <motion.div
        animate={{ opacity: active ? 0 : 1 }}
        className={`relative h-full cursor-pointer overflow-hidden rounded-xl p-3 shadow-sm transition-shadow hover:shadow-md ${typeColor}`}
        initial={{ opacity: 0 }}
        layoutId={`card-${pokemon.id}-${id}`}
        onClick={onClick}
        transition={{
          duration: 0.25,
          ease: [0.32, 0.72, 0, 1],
          opacity: { duration: 0.25 }
        }}
      >
        <div className="absolute inset-0 bg-white/15" />
        <Image
          alt=""
          aria-hidden="true"
          className="absolute -bottom-4 -right-4 opacity-20 grayscale"
          height={96}
          src={`/icons/${(pokemon.types[0] ?? 'normal').toLowerCase()}.svg`}
          width={96}
        />
        <div className="relative flex items-start justify-between">
          <motion.p
            className="text-sm font-semibold capitalize text-white"
            layoutId={`name-${pokemon.id}-${id}`}
            transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
          >
            {pokemon.name}
          </motion.p>
          <span className="text-xs font-semibold text-white">
            #{pokemon.id}
          </span>
        </div>
        <motion.div
          className="relative mt-2 flex flex-wrap gap-1"
          layoutId={`types-${pokemon.id}-${id}`}
          transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
        >
          {pokemon.types.map((type: string) => (
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium text-white ${getTypeColor(type)}`}
              key={type}
            >
              {type}
            </span>
          ))}
        </motion.div>
      </motion.div>
    </>
  )
}

function StatBar({ label, value }: { label: string; value: number }) {
  const pct = Math.round((value / STAT_MAX) * 100)
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="w-20 shrink-0 text-white/70">{label}</span>
      <span className="w-8 shrink-0 text-right font-medium text-white">
        {value}
      </span>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/20">
        <div
          className="h-full rounded-full bg-white/70 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
