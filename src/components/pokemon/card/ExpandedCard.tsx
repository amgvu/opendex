import { Label, Switch, Tabs } from '@heroui/react'
import { AnimatePresence, motion, useDragControls } from 'motion/react'
import Image from 'next/image'
import { type CSSProperties, type RefObject, type SyntheticEvent, useEffect, useRef, useState } from 'react'
import { IoMdStar } from 'react-icons/io'

import type { Pokemon } from '@/types/pokemon'

import { TooltipProvider } from '@/components/ui/tooltip'
import { useCardContext } from '@/context/card'
import { CARD_TRANSITION } from '@/lib/constants'
import {
  bgClassToVar,
  EV_STAT_LABELS,
  formatPokedexId,
  getTypeColor,
  getTypeMatchups
} from '@/lib/pokemon'

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
  const dragControls = useDragControls()
  const tabPanelClass = 'h-64 xl:h-68 overflow-y-auto overscroll-contain [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-black/30'
  const bst =
    pokemon.hp +
    pokemon.attack +
    pokemon.defense +
    pokemon.specialAttack +
    pokemon.specialDefense +
    pokemon.speed
  const { immunities, resistances, weaknesses } = getTypeMatchups(pokemon.types)
  const { activeTab, gifEnabled, setActiveTab, setGifEnabled } = useCardContext()
  const [gifMounted, setGifMounted] = useState(gifEnabled)
  const [gifReady, setGifReady] = useState(false)
  const [gifError, setGifError] = useState(false)
  const [dragging, setDragging] = useState(false)
  const blurRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (gifEnabled) setGifMounted(true)
  }, [gifEnabled])

  function handleArtworkLoad(e: SyntheticEvent<HTMLImageElement>) {
    e.currentTarget.style.opacity = '1'
    if (blurRef.current) blurRef.current.style.backgroundImage = 'none'
  }

  const artworkImage = (
    <Image
      alt={pokemon.name}
      className="h-36 w-36 xl:h-64 xl:w-64 object-contain drop-shadow-2xl"
      height={384}
      onLoad={handleArtworkLoad}
      sizes="200px"
      src={pokemon.officialUrl}
      style={{ opacity: 0, transition: 'opacity 0.2s' }}
      unoptimized
      width={384}
    />
  )

  return (
    <AnimatePresence>
      {active && (
        <>
          <div className="fixed inset-0 z-50 grid place-items-center p-4">
            <motion.div
              className={`relative w-full max-w-md xl:max-w-xl cursor-grab overflow-hidden rounded-2xl shadow-2xl active:cursor-grabbing ${typeColor}`}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragControls={dragControls}
              dragElastic={0.1}
              dragListener={false}
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
                onPointerDown={e => {
                  if (!(e.target as Element).closest('[data-no-drag]')) {
                    dragControls.start(e)
                  }
                }}
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
                    className="flex shrink-0 flex-wrap gap-1"
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

                {pokemon.officialUrl && (
                  <motion.div
                    className="relative mb-4 flex justify-center"
                    layoutId={`image-${pokemon.id}-${id}`}
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
                        animate={{ opacity: gifError || !gifEnabled ? 1 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {artworkImage}
                      </motion.div>
                    </div>
                    {!gifError && gifMounted && (
                      <motion.img
                        alt=""
                        animate={{ opacity: gifEnabled && gifReady ? 1 : 0 }}
                        className="absolute h-36 w-36 xl:h-64 xl:w-64 object-contain"
                        initial={{ opacity: 0 }}
                        onError={() => setGifError(true)}
                        onLoad={() => setGifReady(true)}
                        src={pokemon.imageUrl}
                        transition={{ duration: 0.15 }}
                      />
                    )}
                    {!gifError && (
                      <div className="absolute bottom-0 right-0">
                        <Switch
                          isSelected={gifEnabled}
                          onChange={v => {
                            if (v) setGifMounted(true)
                            setGifEnabled(v)
                          }}
                          size="sm"
                          style={
                            {
                              '--switch-control-bg': `color-mix(in oklab, ${bgClassToVar(typeColor)}, white 40%)`,
                              '--switch-control-bg-checked': bgClassToVar(typeColor),
                              '--switch-control-bg-checked-hover': bgClassToVar(typeColor),
                              '--switch-control-bg-hover': `color-mix(in oklab, ${bgClassToVar(typeColor)}, white 30%)`
                            } as CSSProperties
                          }
                        >
                          <Switch.Control>
                            <Switch.Thumb />
                          </Switch.Control>
                          <Switch.Content>
                            <Label className="text-xs font-medium text-white/70 select-none">
                              3D
                            </Label>
                          </Switch.Content>
                        </Switch>
                      </div>
                    )}
                  </motion.div>
                )}

                <motion.div
                  animate={{ opacity: 1 }}
                  data-no-drag
                  exit={{ opacity: 0 }}
                  initial={{ opacity: 0 }}
                  transition={{ delay: 0.15, duration: 0.2 }}
                >
                  <Tabs
                    onSelectionChange={key => setActiveTab(key as 'battle' | 'bio' | 'stats')}
                    selectedKey={activeTab}
                    style={{
                      '--accent': bgClassToVar(typeColor),
                      '--border': 'rgba(255,255,255,0.25)',
                      '--foreground': 'white',
                      '--muted': 'rgba(255,255,255,0.5)'
                    } as CSSProperties}
                    variant="secondary"
                  >
                    <Tabs.ListContainer>
                      <Tabs.List aria-label="Pokemon info">
                        <Tabs.Tab id="stats">
                          <span className="flex items-center gap-1.5">
                            Stats
                            <span className="text-[10px] font-medium opacity-50">{bst}</span>
                          </span>
                          <Tabs.Indicator />
                        </Tabs.Tab>
                        <Tabs.Tab id="battle">
                          Battle
                          <Tabs.Indicator />
                        </Tabs.Tab>
                        <Tabs.Tab id="bio">
                          Bio
                          <Tabs.Indicator />
                        </Tabs.Tab>
                      </Tabs.List>
                    </Tabs.ListContainer>

                    <Tabs.Panel className={`${tabPanelClass} pt-3 text-sm xl:text-base`} id="stats">
                      <motion.div
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-5"
                        initial={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.15 }}
                      >
                        <div className="flex flex-col gap-2">
                          <StatBar label="HP" value={pokemon.hp} />
                          <StatBar label="Attack" value={pokemon.attack} />
                          <StatBar label="Defense" value={pokemon.defense} />
                          <StatBar label="Sp. Attack" value={pokemon.specialAttack} />
                          <StatBar label="Sp. Defense" value={pokemon.specialDefense} />
                          <StatBar label="Speed" value={pokemon.speed} />
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="flex flex-col">
                            <span className="text-white/60">Height</span>
                            <span className="font-medium text-white">{pokemon.height.toFixed(1)}m</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-white/60">Weight</span>
                            <span className="font-medium text-white">{pokemon.weight.toFixed(1)} lbs</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-white/60">Gen</span>
                            <span className="font-medium text-white">{pokemon.generation}</span>
                          </div>
                        </div>
                      </motion.div>
                    </Tabs.Panel>

                    <Tabs.Panel className={`${tabPanelClass} pt-3 text-sm xl:text-base`} id="battle">
                      <motion.div
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-2"
                        initial={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.15 }}
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
                          <div className="flex flex-col gap-1.5">
                            <span className="text-white/70">Abilities</span>
                            <div className="flex flex-col gap-1.5">
                              {pokemon.abilities.map(a => (
                                <div className="rounded-lg bg-white/10 px-3 py-2" key={a.name}>
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-medium capitalize text-white">{a.name}</span>
                                    {a.isHidden && (
                                      <span className="text-[10px] text-white/50">HA</span>
                                    )}
                                  </div>
                                  {a.description && (
                                    <p className="mt-0.5 text-xs xl:text-sm text-white/60 leading-snug">{a.description}</p>
                                  )}
                                </div>
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
                    </Tabs.Panel>

                    <Tabs.Panel className={`${tabPanelClass} pt-3 text-sm xl:text-base`} id="bio">
                      <motion.div
                        animate={{ opacity: 1, x: 0 }}
                        initial={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.15 }}
                      >
                        <p className="text-white/70">{pokemon.description}</p>
                      </motion.div>
                    </Tabs.Panel>
                  </Tabs>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
