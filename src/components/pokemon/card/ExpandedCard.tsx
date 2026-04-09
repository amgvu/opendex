import { AnimatePresence, motion } from 'motion/react'
import Image from 'next/image'
import { type RefObject, useRef, useState } from 'react'
import { IoMdStar } from 'react-icons/io'

import type { Pokemon } from '@/types/pokemon'

import { TooltipProvider } from '@/components/ui/tooltip'
import { useGifHover } from '@/hooks/card/useGifHover'
import { CARD_TRANSITION } from '@/lib/constants'
import { EV_STAT_LABELS, formatPokedexId, getTypeColor, getTypeMatchups } from '@/lib/pokemon'

import { StatBar } from './StatBar'
import { TypeBadge } from './TypeBadge'
import { TypeIcon } from './TypeIcon'

export function ExpandedCard({
  active,
  id,
  onNext,
  onPrev,
  pokemon,
  ref
}: {
  active: boolean
  id: string
  onNext: () => void
  onPrev: () => void
  pokemon: Pokemon
  ref: RefObject<HTMLDivElement | null>
}) {
  const typeColor = getTypeColor(pokemon.types[0] ?? '')
  const bst = pokemon.hp + pokemon.attack + pokemon.defense + pokemon.specialAttack + pokemon.specialDefense + pokemon.speed
  const { immunities, resistances, weaknesses } = getTypeMatchups(pokemon.types)
  const {
    gifMounted,
    gifReady,
    hovered,
    onClick,
    onPointerLeave,
    onPointerMove,
    setGifReady
  } = useGifHover()
  const [dragging, setDragging] = useState(false)
  const blurRef = useRef<HTMLDivElement>(null)

  return (
    <AnimatePresence>
      {active && (
        <>
          <div className="fixed inset-0 z-50 grid place-items-center p-4">
            <motion.div
              className={`relative w-full max-w-md xl:max-w-xl cursor-grab overflow-hidden rounded-2xl shadow-2xl active:cursor-grabbing ${typeColor}`}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.1}
              layoutId={`card-${pokemon.id}-${id}`}
              onDragEnd={(_, info) => {
                setDragging(false)
                if (info.offset.x < -50) onNext()
                else if (info.offset.x > 50) onPrev()
              }}
              onDragStart={() => setDragging(true)}
              ref={ref}
              transition={CARD_TRANSITION}
            >
              <div className="absolute inset-0 bg-black/25" />
              <Image
                alt=""
                aria-hidden="true"
                className="absolute -bottom-24 -right-32 opacity-10 grayscale"
                height={512}
                loading="eager"
                src={`/icons/${(pokemon.types[0] ?? 'normal').toLowerCase()}.svg`}
                unoptimized
                width={512}
              />
              <div
                className={`relative p-6 ${dragging ? 'select-none' : 'select-text'}`}
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <motion.h2
                        className={`min-w-0 truncate font-bold capitalize text-white ${pokemon.name.length > 14 ? 'text-lg xl:text-xl' : 'text-2xl xl:text-3xl'}`}
                        layoutId={`name-${pokemon.id}-${id}`}
                        transition={CARD_TRANSITION}
                      >
                        {pokemon.name}
                      </motion.h2>
                      {pokemon.isLegendary && (
                        <motion.div
                          layoutId={`star-${pokemon.id}-${id}`}
                          transition={CARD_TRANSITION}
                        >
                          <IoMdStar
                            className="text-yellow-400 xl:hidden"
                            size={22}
                          />
                          <IoMdStar
                            className="text-yellow-400 hidden xl:block"
                            size={26}
                          />
                        </motion.div>
                      )}
                    </div>
                    <span className="text-sm xl:text-base tracking-wide font-semibold text-white/60">
                      {formatPokedexId(pokemon.id)}
                    </span>
                  </div>
                  <motion.div
                    className="flex flex-shrink-0 flex-wrap gap-1"
                    layoutId={`types-${pokemon.id}-${id}`}
                    transition={CARD_TRANSITION}
                  >
                    {pokemon.types.map(type => (
                      <TypeBadge key={type} size="lg" type={type} />
                    ))}
                    {pokemon.isLegendary && (
                      <span className="rounded-full bg-yellow-400 px-2 py-0.5 text-xs xl:px-3 xl:py-1 xl:text-sm font-medium text-black">
                        Legendary
                      </span>
                    )}
                  </motion.div>
                </div>

                {pokemon.imageUrl && (
                  <motion.div
                    className="relative mb-4 flex justify-center"
                    layoutId={`image-${pokemon.id}-${id}`}
                    onClick={onClick}
                    onPointerLeave={onPointerLeave}
                    onPointerMove={onPointerMove}
                    transition={CARD_TRANSITION}
                  >
                    <div
                      className="relative h-36 w-36 xl:h-64 xl:w-64"
                      ref={blurRef}
                      style={
                        pokemon.blurDataURL
                          ? {
                              backgroundImage: `url(${pokemon.blurDataURL})`,
                              backgroundPosition: 'center',
                              backgroundSize: 'cover'
                            }
                          : undefined
                      }
                    >
                      <motion.div
                        animate={{ opacity: hovered && gifReady ? 0 : 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Image
                          alt={pokemon.name}
                          className="h-36 w-36 xl:h-64 xl:w-64 object-contain drop-shadow-2xl"
                          height={384}
                          onLoad={e => {
                            e.currentTarget.style.opacity = '1'
                            if (blurRef.current)
                              blurRef.current.style.backgroundImage = 'none'
                          }}
                          sizes="200px"
                          src={pokemon.officialUrl}
                          style={{ opacity: 0, transition: 'opacity 0.2s' }}
                          unoptimized
                          width={384}
                        />
                      </motion.div>
                    </div>
                    {gifMounted && (
                      <motion.img
                        alt=""
                        animate={{ opacity: hovered && gifReady ? 1 : 0 }}
                        className="absolute h-36 w-36 xl:h-64 xl:w-64 object-contain"
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
                  className="mb-4 text-sm xl:text-base text-white/70"
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
                  <div className="mt-1 flex items-center gap-3 border-t border-white/20 pt-2 text-sm xl:text-base">
                    <span className="w-20 xl:w-24 shrink-0 text-white/70">Total</span>
                    <span className="w-8 shrink-0 text-right font-medium text-white">{bst}</span>
                    <div className="flex-1" />
                  </div>
                </motion.div>

                <motion.div
                  animate={{ opacity: 1 }}
                  className="mt-2 grid grid-cols-3 gap-2 text-sm xl:text-base"
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

                <motion.div
                  animate={{ opacity: 1 }}
                  className="mt-2 space-y-2 text-sm xl:text-base"
                  exit={{ opacity: 0 }}
                  initial={{ opacity: 0 }}
                  transition={{ delay: 0.15, duration: 0.2 }}
                >
                  {pokemon.evYield && pokemon.evYield.length > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="w-14 shrink-0 text-white/70">EV</span>
                      <div className="flex flex-nowrap gap-1.5">
                        {pokemon.evYield.map(({ stat, value }) => (
                          <span
                            className="rounded-full bg-white/15 px-2.5 py-0.5 text-xs xl:text-sm font-medium text-white"
                            key={stat}
                          >
                            +{value} {EV_STAT_LABELS[stat] ?? stat}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {pokemon.abilities && pokemon.abilities.length > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="w-14 shrink-0 text-white/70">Ability</span>
                      <div className="flex flex-nowrap gap-1.5 overflow-x-auto">
                        {pokemon.abilities.map(a => (
                          <span
                            className="flex shrink-0 items-center gap-1 rounded-full bg-white/15 px-2.5 py-0.5 text-xs xl:text-sm font-medium capitalize text-white"
                            key={a.name}
                          >
                            {a.name}
                            {a.isHidden && <span className="text-[10px] text-white/50">HA</span>}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {(weaknesses.length > 0 || resistances.length > 0 || immunities.length > 0) && (
                    <TooltipProvider>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="min-w-0">
                        <span className="mb-1 block text-white/60">Weak</span>
                        <div className="flex flex-wrap gap-1">
                          {weaknesses.map(({ multiplier, type }) => (
                            <TypeIcon key={type} multiplier={multiplier} type={type} />
                          ))}
                        </div>
                      </div>
                      <div className="min-w-0">
                        <span className="mb-1 block text-white/60">Resist</span>
                        <div className="flex flex-wrap gap-1">
                          {resistances.length > 0
                            ? resistances.map(({ multiplier, type }) => (
                                <TypeIcon key={type} multiplier={multiplier} type={type} />
                              ))
                            : <span className="text-white/30">—</span>
                          }
                        </div>
                      </div>
                      <div className="min-w-0">
                        <span className="mb-1 block text-white/60">Immune</span>
                        <div className="flex flex-wrap gap-1">
                          {immunities.length > 0
                            ? immunities.map(type => (
                                <TypeIcon immune key={type} type={type} />
                              ))
                            : <span className="text-white/30">—</span>
                          }
                        </div>
                      </div>
                    </div>
                    </TooltipProvider>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}


