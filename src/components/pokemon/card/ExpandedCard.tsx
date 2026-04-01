import { AnimatePresence, motion } from 'motion/react'
import Image from 'next/image'
import { type RefObject, useRef, useState } from 'react'
import { IoMdStar } from 'react-icons/io'

import type { Pokemon } from '@/types/pokemon'

import { useGifHover } from '@/hooks/card/useGifHover'
import { useCollection } from '@/hooks/query/useCollection'
import { CARD_TRANSITION } from '@/lib/constants'
import { formatPokedexId, getTypeColor } from '@/lib/pokemon'
import { xpProgress } from '@/lib/pokemon-lookup'
import type { CollectionItem } from '@/types/collection'

import { StatBar } from './StatBar'
import { TypeBadge } from './TypeBadge'

export function ExpandedCard({
  active,
  collectionItem,
  id,
  onNext,
  onPrev,
  pokemon,
  ref
}: {
  active: boolean
  collectionItem?: CollectionItem
  id: string
  onNext: () => void
  onPrev: () => void
  pokemon: Pokemon
  ref: RefObject<HTMLDivElement | null>
}) {
  const typeColor = getTypeColor(pokemon.types[0] ?? '')
  const { isInCollection, add, remove } = useCollection()
  const inCollection = isInCollection(pokemon.id)
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
                  className="mb-4"
                  exit={{ opacity: 0 }}
                  initial={{ opacity: 0 }}
                  transition={{ delay: 0.15, duration: 0.2 }}
                >
                  {inCollection ? (
                    <button
                      className="w-full rounded-xl bg-white/20 py-2 text-sm font-semibold text-white hover:bg-red-500/60 transition-colors"
                      onClick={() => remove.mutate(pokemon.id)}
                      disabled={remove.isPending}
                    >
                      {remove.isPending
                        ? 'Removing...'
                        : '✓ In Collection — Remove'}
                    </button>
                  ) : (
                    <button
                      className="w-full rounded-xl bg-white/20 py-2 text-sm font-semibold text-white hover:bg-white/30 transition-colors"
                      onClick={() => add.mutate(pokemon)}
                      disabled={add.isPending}
                    >
                      {add.isPending ? 'Adding...' : '+ Add to Collection'}
                    </button>
                  )}
                </motion.div>

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
                  className="mt-4 grid grid-cols-3 gap-2 text-sm xl:text-base"
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

                {collectionItem && (
                  <motion.div
                    animate={{ opacity: 1 }}
                    className="mt-4 border-t border-white/20 pt-4 flex flex-col gap-3"
                    exit={{ opacity: 0 }}
                    initial={{ opacity: 0 }}
                    transition={{ delay: 0.2, duration: 0.2 }}
                  >
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/60">
                        Level {collectionItem.level}
                      </span>
                      <span className="text-white/60 text-xs">
                        {collectionItem.level < 10
                          ? `${Math.round(xpProgress(collectionItem.experience, collectionItem.level) * 100)}% to Lv. ${collectionItem.level + 1}`
                          : 'Max Level'}
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/20">
                      <div
                        className="h-full rounded-full bg-white/70 transition-all duration-500"
                        style={{
                          width: `${xpProgress(collectionItem.experience, collectionItem.level) * 100}%`
                        }}
                      />
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-center text-xs">
                      <div className="flex flex-col">
                        <span className="text-white/50">Rating</span>
                        <span className="font-semibold text-white">
                          {collectionItem.rating}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-white/50">Battles</span>
                        <span className="font-semibold text-white">
                          {collectionItem.timesBattled}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-white/50">Wins</span>
                        <span className="font-semibold text-white">
                          {collectionItem.winStreak}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-white/50">Losses</span>
                        <span className="font-semibold text-white">
                          {collectionItem.lossStreak}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
