'use client'

import { Tabs } from '@heroui/react'
import { AnimatePresence, motion } from 'motion/react'
import Image from 'next/image'
import { type CSSProperties, useState } from 'react'
import { createPortal } from 'react-dom'
import { IoMdStar } from 'react-icons/io'
import {
  TbArrowsDiagonalMinimize2,
  TbCheck,
  TbChevronLeft,
  TbChevronRight,
  TbLink,
  TbSparkles,
  TbX
} from 'react-icons/tb'

import type { Pokemon } from '@/types/pokemon'

import { useCardContext } from '@/context/card'
import { useNavContext } from '@/context/navigation'
import { useGifLoader } from '@/hooks/card/useGifLoader'
import { CARD_TRANSITION } from '@/lib/constants'
import { bgClassToVar, formatPokedexId, getTypeColor } from '@/lib/pokemon'
import { useSelectionStore } from '@/stores/selectionStore'

import { ArtworkSwitches } from '../ArtworkSwitches'
import { EvolutionPanel } from '../expanded/EvolutionPanel'
import { TypeBadge } from '../TypeBadge'
import { FullBattlePanel } from './FullBattlePanel'
import { FullBioPanel } from './FullBioPanel'
import { FullMovesPanel } from './FullMovesPanel'
import { FullStatsPanel } from './FullStatsPanel'

const TAB_PANEL_SCROLL =
  'flex-1 min-h-0 overflow-x-hidden overflow-y-auto overscroll-contain mb-4 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-black/30'

export function FullModal({ id, pokemon }: { id: string; pokemon: Pokemon }) {
  const {
    activeTab,
    fullModalOpen,
    gifEnabled,
    setActiveTab,
    setFullModalOpen,
    setGifEnabled,
    setShinyEnabled,
    shinyEnabled
  } = useCardContext()
  // If fullModal is already open when this instance mounts (nav from full modal),
  // skip all FLIP animations — the card should appear instantly.
  const [skipFLIP] = useState(fullModalOpen)
  const { onNext, onPrev } = useNavContext()
  const setSelectedName = useSelectionStore(s => s.setSelectedName)
  const { gifError, gifMounted, gifReady, setGifError, setGifReady } =
    useGifLoader(gifEnabled, shinyEnabled)

  const artSrc = shinyEnabled ? (pokemon.shiny?.officialUrl ?? pokemon.officialUrl) : pokemon.officialUrl
  const gifSrc = shinyEnabled ? (pokemon.shiny?.imageUrl ?? pokemon.imageUrl) : pokemon.imageUrl
  const [copied, setCopied] = useState(false)
  const typeColor = getTypeColor(pokemon.types[0] ?? '')
  const bst =
    pokemon.hp +
    pokemon.attack +
    pokemon.defense +
    pokemon.specialAttack +
    pokemon.specialDefense +
    pokemon.speed

  function handleCopy() {
    const params = new URLSearchParams(window.location.search)
    params.set('pokemon', pokemon.name)
    const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`
    void navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const closeAll = () => {
    setFullModalOpen(false)
    setSelectedName(null)
  }

  return createPortal(
    <AnimatePresence>
      {fullModalOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center px-4 py-6 2xl:px-6"
          data-outside-click-ignore
          onPointerDown={e => e.stopPropagation()}
        >
          {/* Backdrop */}
          <motion.div
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            exit={{ opacity: 0 }}
            initial={{ opacity: skipFLIP ? 1 : 0 }}
            onClick={closeAll}
            transition={{ duration: skipFLIP ? 0 : 0.2 }}
          />

          {/* Modal card */}
          <motion.div
            className={`relative flex h-full w-full max-w-7xl overflow-hidden rounded-2xl 2xl:max-w-screen-2xl ${typeColor}`}
            layoutId={skipFLIP ? undefined : `card-${pokemon.name}-${id}`}
            onClick={e => e.stopPropagation()}
            transition={skipFLIP ? { duration: 0 } : CARD_TRANSITION}
          >
            {/* Type watermark — large, bottom-right */}
            <Image
              alt=""
              aria-hidden="true"
              className="absolute scale-[4] bottom-64 right-16 h-[640px] w-[640px] opacity-10 grayscale"
              height={512}
              loading="eager"
              src={`/icons/${(pokemon.types[0] ?? 'normal').toLowerCase()}.svg`}
              unoptimized
              width={512}
            />

            {/* Inset border + dark overlay */}
            <div
              className="pointer-events-none absolute inset-3 rounded-xl border bg-black/25"
              style={{
                borderColor: `color-mix(in oklab, ${bgClassToVar(typeColor)}, black 25%)`,
                boxShadow: `inset 0 0 1px color-mix(in oklab, ${bgClassToVar(typeColor)}, black 40%)`
              }}
            />

            {/* ── LEFT: artwork + controls + stats ── */}
            <div className="relative z-10 flex w-[32%] shrink-0 flex-col border-r border-white/10">
              {/* Artwork — fills flex-1, scales with panel */}
              <div className="relative flex min-h-0 flex-1 items-center justify-center px-8 pt-16 pb-3">
                {pokemon.officialUrl && (
                  <motion.div
                    className="relative w-full"
                    layoutId={skipFLIP ? undefined : `image-${pokemon.name}-${id}`}
                    style={{ aspectRatio: '1' }}
                    transition={skipFLIP ? { duration: 0 } : CARD_TRANSITION}
                  >
                    <motion.div
                      animate={{ opacity: gifError || !gifEnabled ? 1 : 0 }}
                      className="h-full w-full"
                      transition={{ duration: 0.2 }}
                    >
                      <Image
                        alt={pokemon.name}
                        className="object-contain"
                        draggable={false}
                        fill
                        onContextMenu={e => e.preventDefault()}
                        sizes="(min-width: 1536px) 420px, (min-width: 1280px) 360px, 300px"
                        src={artSrc}
                        style={{
                          filter: `drop-shadow(0 24px 40px color-mix(in oklab, ${bgClassToVar(typeColor)}, black 50%))`
                        }}
                        unoptimized
                      />
                    </motion.div>
                    {!gifError && gifMounted && (
                      <motion.img
                        alt=""
                        animate={{ opacity: gifEnabled && gifReady ? 1 : 0 }}
                        className="absolute inset-0 h-full w-full object-contain"
                        draggable={false}
                        initial={{ opacity: 0 }}
                        onContextMenu={e => e.preventDefault()}
                        onError={() => setGifError(true)}
                        onLoad={() => setGifReady(true)}
                        src={gifSrc}
                        transition={{ duration: 0.15 }}
                      />
                    )}
                  </motion.div>
                )}
              </div>

              {/* Controls row */}
              <div className="flex shrink-0 items-center justify-between border-t border-white/10 px-8 py-2.5">
                <button
                  className="flex cursor-pointer items-center gap-1 text-xs font-medium text-white/60 transition-colors hover:text-white/90 select-none"
                  onClick={handleCopy}
                  type="button"
                >
                  {copied ? <TbCheck size={14} /> : <TbLink size={14} />}
                  {copied ? 'Copied!' : 'Copy link'}
                </button>
                <div className="flex items-center gap-3">
                  <ArtworkSwitches
                    gifError={gifError}
                    gifEnabled={gifEnabled}
                    labelClassName="cursor-pointer select-none text-xs font-medium text-white/60"
                    pokemon={pokemon}
                    setGifEnabled={setGifEnabled}
                    setShinyEnabled={setShinyEnabled}
                    shinyEnabled={shinyEnabled}
                    typeColor={typeColor}
                  />
                </div>
              </div>

              {/* Physical stats grid */}
              <div className="grid shrink-0 grid-cols-2 gap-x-6 gap-y-3 px-8 py-5">
                <PhysicalStat
                  label="Height"
                  value={`${pokemon.height.toFixed(1)} m`}
                />
                <PhysicalStat
                  label="Weight"
                  value={`${pokemon.weight.toFixed(1)} lbs`}
                />
                <PhysicalStat
                  label="Generation"
                  value={`Gen ${pokemon.generation}`}
                />
                <PhysicalStat label="Base Total" value={bst} />
              </div>
            </div>

            {/* ── RIGHT: identity header + tabs ── */}
            <div
              className="relative z-10 flex min-h-0 flex-1 flex-col"
              style={
                {
                  '--accent': bgClassToVar(typeColor),
                  '--border': 'rgba(255,255,255,0.25)',
                  '--foreground': 'white',
                  '--muted': 'rgba(255,255,255,0.5)'
                } as CSSProperties
              }
            >
              {/* Identity header */}
              <div className="shrink-0 px-8 pb-5 pt-16">
                {/* Name row */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <motion.h2
                      className={`truncate font-black capitalize leading-tight text-white ${
                        pokemon.name.length > 12
                          ? 'text-3xl xl:text-4xl 2xl:text-5xl'
                          : 'text-4xl xl:text-5xl 2xl:text-6xl'
                      }`}
                      layoutId={skipFLIP ? undefined : `name-${pokemon.name}-${id}`}
                      transition={skipFLIP ? { duration: 0 } : CARD_TRANSITION}
                    >
                      {pokemon.name}
                    </motion.h2>
                    {(pokemon.isMythical || pokemon.isLegendary) && (
                      <motion.div
                        layoutId={skipFLIP ? undefined : `star-${pokemon.name}-${id}`}
                        transition={skipFLIP ? { duration: 0 } : CARD_TRANSITION}
                      >
                        {pokemon.isMythical && (
                          <TbSparkles
                            className="mb-0.5 shrink-0 text-pink-400"
                            size={22}
                          />
                        )}
                        {pokemon.isLegendary && (
                          <IoMdStar
                            className="mb-0.5 shrink-0 text-yellow-400"
                            size={22}
                          />
                        )}
                      </motion.div>
                    )}
                  </div>
                  <span className="mt-1 shrink-0 font-mono text-base font-semibold tracking-widest text-white/30 xl:text-lg">
                    {formatPokedexId(pokemon.id)}
                  </span>
                </div>

                {/* Genus */}
                {pokemon.genus && (
                  <p className="mt-1 text-sm italic text-white/45 xl:text-base">
                    {pokemon.genus}
                  </p>
                )}

                {/* Types + special badges */}
                <motion.div
                  className="mt-3 flex flex-wrap items-center gap-2"
                  layoutId={skipFLIP ? undefined : `types-${pokemon.name}-${id}`}
                  transition={skipFLIP ? { duration: 0 } : CARD_TRANSITION}
                >
                  {pokemon.types.map(type => (
                    <TypeBadge key={type} size="lg" type={type} />
                  ))}
                  {pokemon.isMythical && (
                    <span className="rounded-full bg-pink-400 px-2.5 py-0.5 text-xs font-semibold text-black">
                      Mythical
                    </span>
                  )}
                  {pokemon.isLegendary && (
                    <span className="rounded-full bg-yellow-400 px-2.5 py-0.5 text-xs font-semibold text-black">
                      Legendary
                    </span>
                  )}
                </motion.div>
              </div>

              {/* Divider */}
              <div className="mx-5 shrink-0 border-t border-white/10" />

              {/* Tabs */}
              <motion.div
                animate={{ opacity: 1 }}
                className="flex min-h-0 flex-1 flex-col px-8 pt-4"
                initial={{ opacity: skipFLIP ? 1 : 0 }}
                transition={skipFLIP ? { duration: 0 } : { ...CARD_TRANSITION, delay: 0.1 }}
              >
                <Tabs
                  className="flex min-h-0 flex-1 flex-col"
                  onSelectionChange={key =>
                    setActiveTab(
                      key as 'battle' | 'bio' | 'evo' | 'moves' | 'stats'
                    )
                  }
                  selectedKey={activeTab}
                  variant="secondary"
                >
                  <Tabs.ListContainer>
                    <Tabs.List aria-label="Pokemon info">
                      <Tabs.Tab className="text-sm xl:text-base" id="stats">
                        Stats
                        <Tabs.Indicator />
                      </Tabs.Tab>
                      <Tabs.Tab className="text-sm xl:text-base" id="battle">
                        Battle
                        <Tabs.Indicator />
                      </Tabs.Tab>
                      <Tabs.Tab className="text-sm xl:text-base" id="bio">
                        Bio
                        <Tabs.Indicator />
                      </Tabs.Tab>
                      <Tabs.Tab className="text-sm xl:text-base" id="moves">
                        Moves
                        <Tabs.Indicator />
                      </Tabs.Tab>
                      <Tabs.Tab className="text-sm xl:text-base" id="evo">
                        Evol
                        <Tabs.Indicator />
                      </Tabs.Tab>
                    </Tabs.List>
                  </Tabs.ListContainer>
                  <Tabs.Panel
                    className={`${TAB_PANEL_SCROLL} pt-4 text-sm xl:text-base`}
                    id="stats"
                  >
                    {activeTab === 'stats' && (
                      <FullStatsPanel bst={bst} pokemon={pokemon} />
                    )}
                  </Tabs.Panel>
                  <Tabs.Panel
                    className={`${TAB_PANEL_SCROLL} pt-4 text-sm xl:text-base`}
                    id="battle"
                  >
                    {activeTab === 'battle' && (
                      <FullBattlePanel pokemon={pokemon} />
                    )}
                  </Tabs.Panel>
                  <Tabs.Panel
                    className={`${TAB_PANEL_SCROLL} pt-4 text-sm xl:text-base`}
                    id="bio"
                  >
                    {activeTab === 'bio' && <FullBioPanel pokemon={pokemon} />}
                  </Tabs.Panel>
                  <Tabs.Panel className={`${TAB_PANEL_SCROLL} pt-4`} id="moves">
                    {activeTab === 'moves' && (
                      <FullMovesPanel pokemon={pokemon} />
                    )}
                  </Tabs.Panel>
                  <Tabs.Panel className={`${TAB_PANEL_SCROLL} pt-4`} id="evo">
                    {activeTab === 'evo' && (
                      <EvolutionPanel large pokemon={pokemon} />
                    )}
                  </Tabs.Panel>
                </Tabs>
              </motion.div>
            </div>

            {/* ── TOP-RIGHT CONTROLS ── */}
            <div className="absolute right-4 top-4 z-20 flex items-center gap-1">
              <button
                aria-label="Previous"
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-white/60 transition-colors hover:bg-black/30 hover:text-white"
                onClick={onPrev}
                type="button"
              >
                <TbChevronLeft size={16} />
              </button>
              <button
                aria-label="Next"
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-white/60 transition-colors hover:bg-black/30 hover:text-white"
                onClick={onNext}
                type="button"
              >
                <TbChevronRight size={16} />
              </button>
              <button
                aria-label="Close"
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-white/60 transition-colors hover:bg-black/30 hover:text-white"
                onClick={closeAll}
                type="button"
              >
                <TbX size={16} />
              </button>
            </div>

            {/* ── BOTTOM-RIGHT MINIMIZE ── */}
            <button
              aria-label="Minimize to card"
              className="absolute bottom-4 right-4 z-20 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-white/60 transition-colors hover:bg-black/30 hover:text-white"
              onClick={() => setFullModalOpen(false)}
              type="button"
            >
              <TbArrowsDiagonalMinimize2 size={16} />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  )
}

function PhysicalStat({
  label,
  value
}: {
  label: string
  value: number | string
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[11px] font-medium uppercase tracking-wider text-white/40">
        {label}
      </span>
      <span className="font-semibold text-white text-sm xl:text-base">
        {value}
      </span>
    </div>
  )
}
