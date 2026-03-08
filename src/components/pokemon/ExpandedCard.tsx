import {
  animate,
  AnimatePresence,
  motion,
  useMotionValue,
  useTransform
} from 'motion/react'
import Image from 'next/image'
import { type RefObject, useEffect, useState } from 'react'
import { IoMdStar } from 'react-icons/io'

import type { Pokemon } from '@/types/pokemon'

import { formatPokedexId, getTypeColor } from '@/lib/pokemon'

const STAT_MAX = 255

export function ExpandedCard({
  active,
  id,
  pokemon,
  ref
}: {
  active: boolean
  id: string
  pokemon: Pokemon
  ref: RefObject<HTMLDivElement | null>
}) {
  const typeColor = getTypeColor(pokemon.types[0] ?? '')
  const [hovered, setHovered] = useState(false)
  const [gifMounted, setGifMounted] = useState(false)
  const [gifReady, setGifReady] = useState(false)

  return (
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
              <Image
                alt=""
                aria-hidden="true"
                className="absolute -bottom-16 -right-24 opacity-10 grayscale"
                height={512}
                src={`/icons/${(pokemon.types[0] ?? 'normal').toLowerCase()}.svg`}
                width={512}
              />
              <div className="relative p-6">
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
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
                      {pokemon.isLegendary && (
                        <motion.div
                          layoutId={`star-${pokemon.id}-${id}`}
                          transition={{
                            duration: 0.25,
                            ease: [0.32, 0.72, 0, 1]
                          }}
                        >
                          <IoMdStar className="text-yellow-400" size={22} />
                        </motion.div>
                      )}
                    </div>
                    <span className="text-sm tracking-wide text-white/60">
                      {formatPokedexId(pokemon.id)}
                    </span>
                  </div>
                  <motion.div
                    className="flex flex-wrap gap-1"
                    layoutId={`types-${pokemon.id}-${id}`}
                    transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
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
                    className="relative mb-4 flex justify-center"
                    exit={{ opacity: 0 }}
                    initial={{ opacity: 0 }}
                    onHoverEnd={() => setHovered(false)}
                    onHoverStart={() => {
                      setHovered(true)
                      setGifMounted(true)
                    }}
                    transition={{ delay: 0.15, duration: 0.2 }}
                  >
                    <motion.div
                      animate={{ opacity: hovered && gifReady ? 0 : 1 }}
                      transition={{ duration: 0.15 }}
                    >
                      <Image
                        alt={pokemon.name}
                        className="h-50 w-50 object-contain drop-shadow-2xl"
                        height={200}
                        src={pokemon.officialUrl}
                        unoptimized
                        width={200}
                      />
                    </motion.div>
                    {gifMounted && (
                      <motion.img
                        alt=""
                        animate={{ opacity: hovered && gifReady ? 1 : 0 }}
                        className="absolute h-50 w-50 object-contain drop-shadow-2xl"
                        initial={{ opacity: 0 }}
                        onLoad={() => setGifReady(true)}
                        src={pokemon.imageUrl}
                        transition={{ duration: 0.15 }}
                      />
                    )}
                  </motion.div>
                )}

                <motion.p
                  animate={{ opacity: 1 }}
                  className="mb-4 text-sm text-white/70"
                  exit={{ opacity: 0 }}
                  initial={{ opacity: 0 }}
                  transition={{ delay: 0.15, duration: 0.2 }}
                >
                  {pokemon.description}
                </motion.p>

                <motion.div
                  animate={{ opacity: 1 }}
                  className="flex flex-col gap-2"
                  exit={{ opacity: 0 }}
                  initial={{ opacity: 0 }}
                  transition={{ delay: 0.15, duration: 0.2 }}
                >
                  <StatBar label="HP" value={pokemon.hp} />
                  <StatBar label="Attack" value={pokemon.attack} />
                  <StatBar label="Defense" value={pokemon.defense} />
                  <StatBar label="Sp. Attack" value={pokemon.specialAttack} />
                  <StatBar label="Sp. Defense" value={pokemon.specialDefense} />
                  <StatBar label="Speed" value={pokemon.speed} />
                </motion.div>

                <motion.div
                  animate={{ opacity: 1 }}
                  className="mt-4 grid grid-cols-3 gap-2 text-sm"
                  exit={{ opacity: 0 }}
                  initial={{ opacity: 0 }}
                  transition={{ delay: 0.15, duration: 0.15 }}
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
    </AnimatePresence>
  )
}

function StatBar({ label, value }: { label: string; value: number }) {
  const pct = Math.round((value / STAT_MAX) * 100)
  const count = useMotionValue(0)
  const rounded = useTransform(count, v => Math.round(v))

  useEffect(() => {
    const controls = animate(count, value, {
      delay: 0.15,
      duration: 0.3,
      ease: 'easeOut'
    })
    return controls.stop
  }, [count, value])

  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="w-20 shrink-0 text-white/70">{label}</span>
      <motion.span className="w-8 shrink-0 text-right font-medium text-white">
        {rounded}
      </motion.span>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/20">
        <motion.div
          animate={{ width: `${pct}%` }}
          className="h-full rounded-full bg-white/70"
          initial={{ width: '0%' }}
          transition={{ delay: 0.15, duration: 0.3, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}
