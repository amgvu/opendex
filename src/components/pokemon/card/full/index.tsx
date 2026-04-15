'use client'

import { Label, Switch, Tabs } from '@heroui/react'
import { AnimatePresence, motion } from 'motion/react'
import Image from 'next/image'
import { type CSSProperties, useState } from 'react'
import { createPortal } from 'react-dom'
import { IoMdStar } from 'react-icons/io'
import { TbCheck, TbChevronLeft, TbChevronRight, TbLink, TbMinimize, TbSparkles, TbX } from 'react-icons/tb'

import type { Pokemon } from '@/types/pokemon'

import { useCardContext } from '@/context/card'
import { useNavContext } from '@/context/navigation'
import { useGifLoader } from '@/hooks/card/useGifLoader'
import { bgClassToVar, formatPokedexId, getTypeColor } from '@/lib/pokemon'
import { useSelectionStore } from '@/stores/selectionStore'

import { TypeBadge } from '../TypeBadge'
import { EvolutionPanel } from '../expanded/EvolutionPanel'
import { FullBattlePanel } from './FullBattlePanel'
import { FullBioPanel } from './FullBioPanel'
import { FullMovesPanel } from './FullMovesPanel'
import { FullStatsPanel } from './FullStatsPanel'

const TAB_PANEL_SCROLL =
  'flex-1 min-h-0 overflow-x-hidden overflow-y-auto overscroll-contain [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-black/30'

export function FullModal({ pokemon }: { pokemon: Pokemon }) {
  const { activeTab, fullModalOpen, gifEnabled, setActiveTab, setFullModalOpen, setGifEnabled } =
    useCardContext()
  const { onNext, onPrev } = useNavContext()
  const setSelectedId = useSelectionStore(s => s.setSelectedId)
  const { gifError, gifMounted, gifReady, setGifError, setGifReady } = useGifLoader(gifEnabled)
  const [copied, setCopied] = useState(false)
  const typeColor = getTypeColor(pokemon.types[0] ?? '')

  function handleCopy() {
    const params = new URLSearchParams(window.location.search)
    params.set('pokemon', String(pokemon.id))
    const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  const bst =
    pokemon.hp +
    pokemon.attack +
    pokemon.defense +
    pokemon.specialAttack +
    pokemon.specialDefense +
    pokemon.speed

  const closeAll = () => { setFullModalOpen(false); setSelectedId(null) }

  return createPortal(
    <AnimatePresence>
      {fullModalOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center px-4 py-6 2xl:px-6"
          data-outside-click-ignore
          onPointerDown={e => e.stopPropagation()}
        >
          <motion.div
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            onClick={closeAll}
            transition={{ duration: 0.2 }}
          />
          <motion.div
            animate={{ opacity: 1, scale: 1 }}
            className={`relative flex h-full w-full max-w-7xl overflow-hidden rounded-2xl 2xl:max-w-screen-2xl ${typeColor}`}
            exit={{ opacity: 0, scale: 0.97 }}
            initial={{ opacity: 0, scale: 0.97 }}
            onClick={e => e.stopPropagation()}
            transition={{ duration: 0.2 }}
          >
            <Image
              alt=""
              aria-hidden="true"
              className="absolute -bottom-16 -right-16 h-[512px] w-[512px] opacity-10 grayscale"
              height={512}
              loading="eager"
              src={`/icons/${(pokemon.types[0] ?? 'normal').toLowerCase()}.svg`}
              unoptimized
              width={512}
            />
            <div
              className="pointer-events-none absolute inset-3 rounded-xl border bg-black/25"
              style={{
                borderColor: `color-mix(in oklab, ${bgClassToVar(typeColor)}, black 25%)`,
                boxShadow: `inset 0 0 1px color-mix(in oklab, ${bgClassToVar(typeColor)}, black 40%)`
              }}
            />

            {/* LEFT SIDEBAR */}
            <div className="relative z-10 flex w-[28%] min-w-0 shrink-0 flex-col items-center gap-5 border-r border-white/10 p-8 pb-6">
              {pokemon.officialUrl && (
                <div className="relative flex flex-1 items-center justify-center">
                  <div className="relative h-44 w-44 xl:h-56 xl:w-56 2xl:h-64 2xl:w-64">
                    <motion.div
                      animate={{ opacity: gifError || !gifEnabled ? 1 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Image
                        alt={pokemon.name}
                        className="h-44 w-44 xl:h-56 xl:w-56 2xl:h-64 2xl:w-64 object-contain"
                        draggable={false}
                        height={384}
                        onContextMenu={e => e.preventDefault()}
                        src={pokemon.officialUrl}
                        style={{
                          filter: `drop-shadow(0 20px 30px color-mix(in oklab, ${bgClassToVar(typeColor)}, black 40%))`
                        }}
                        unoptimized
                        width={384}
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
                        src={pokemon.imageUrl}
                        transition={{ duration: 0.15 }}
                      />
                    )}
                  </div>
                  <div className="absolute bottom-0 left-0">
                    <button
                      className="flex cursor-pointer items-center gap-1 text-xs font-medium text-white/70 select-none"
                      onClick={handleCopy}
                      type="button"
                    >
                      {copied ? <TbCheck size={14} /> : <TbLink size={14} />}
                      <span>{copied ? 'Copied!' : 'Copy link'}</span>
                    </button>
                  </div>
                  {!gifError && (
                    <div className="absolute bottom-0 right-0">
                      <Switch
                        isSelected={gifEnabled}
                        onChange={v => setGifEnabled(v)}
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
                          <Label className="cursor-pointer select-none text-xs font-medium text-white/70">
                            3D
                          </Label>
                        </Switch.Content>
                      </Switch>
                    </div>
                  )}
                </div>
              )}

              <div className="w-full text-center">
                <div className="flex items-center justify-center gap-2">
                  <h2
                    className={`truncate font-bold capitalize text-white ${
                      pokemon.name.length > 14
                        ? 'text-xl xl:text-2xl 2xl:text-3xl'
                        : 'text-2xl xl:text-3xl 2xl:text-4xl'
                    }`}
                  >
                    {pokemon.name}
                  </h2>
                  {pokemon.isMythical && (
                    <TbSparkles className="shrink-0 text-pink-400" size={20} />
                  )}
                  {pokemon.isLegendary && (
                    <IoMdStar className="shrink-0 text-yellow-400" size={20} />
                  )}
                </div>
                <span className="block font-semibold tracking-wide text-white/50 text-sm xl:text-base">
                  {formatPokedexId(pokemon.id)}
                </span>
                {pokemon.genus && (
                  <span className="mt-0.5 block italic text-white/40 text-xs xl:text-sm">
                    {pokemon.genus}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap justify-center gap-1.5">
                {pokemon.types.map(type => (
                  <TypeBadge key={type} size="lg" type={type} />
                ))}
                {pokemon.isMythical && (
                  <span className="rounded-full bg-pink-400 px-2.5 py-0.5 text-xs font-medium text-black">
                    Mythical
                  </span>
                )}
                {pokemon.isLegendary && (
                  <span className="rounded-full bg-yellow-400 px-2.5 py-0.5 text-xs font-medium text-black">
                    Legendary
                  </span>
                )}
              </div>

              <div className="grid w-full grid-cols-2 gap-x-6 gap-y-2.5">
                <SidebarStat label="Height" value={`${pokemon.height.toFixed(1)} m`} />
                <SidebarStat label="Weight" value={`${pokemon.weight.toFixed(1)} lbs`} />
                <SidebarStat label="Generation" value={`Gen ${pokemon.generation}`} />
                <SidebarStat label="Base Total" value={bst} />
              </div>
            </div>

            {/* RIGHT CONTENT */}
            <div
              className="relative z-10 flex min-h-0 flex-1 flex-col p-6 pt-14"
              style={
                {
                  '--accent': bgClassToVar(typeColor),
                  '--border': 'rgba(255,255,255,0.25)',
                  '--foreground': 'white',
                  '--muted': 'rgba(255,255,255,0.5)'
                } as CSSProperties
              }
            >
              <Tabs
                className="flex min-h-0 flex-1 flex-col"
                onSelectionChange={key =>
                  setActiveTab(key as 'battle' | 'bio' | 'evo' | 'moves' | 'stats')
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
                  {activeTab === 'stats' && <FullStatsPanel bst={bst} pokemon={pokemon} />}
                </Tabs.Panel>
                <Tabs.Panel
                  className={`${TAB_PANEL_SCROLL} pt-4 text-sm xl:text-base`}
                  id="battle"
                >
                  {activeTab === 'battle' && <FullBattlePanel pokemon={pokemon} />}
                </Tabs.Panel>
                <Tabs.Panel
                  className={`${TAB_PANEL_SCROLL} pt-4 text-sm xl:text-base`}
                  id="bio"
                >
                  {activeTab === 'bio' && <FullBioPanel pokemon={pokemon} />}
                </Tabs.Panel>
                <Tabs.Panel className={`${TAB_PANEL_SCROLL} pt-4`} id="moves">
                  {activeTab === 'moves' && <FullMovesPanel pokemon={pokemon} />}
                </Tabs.Panel>
                <Tabs.Panel className={`${TAB_PANEL_SCROLL} pt-4`} id="evo">
                  {activeTab === 'evo' && <EvolutionPanel pokemon={pokemon} />}
                </Tabs.Panel>
              </Tabs>
            </div>

            {/* TOP-RIGHT CONTROLS */}
            <div className="absolute right-4 top-4 z-20 flex items-center gap-1">
              <button
                aria-label="Previous Pokemon"
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-black/20 text-white/60 transition-colors hover:bg-black/30 hover:text-white"
                onClick={onPrev}
                type="button"
              >
                <TbChevronLeft size={16} />
              </button>
              <button
                aria-label="Next Pokemon"
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-black/20 text-white/60 transition-colors hover:bg-black/30 hover:text-white"
                onClick={onNext}
                type="button"
              >
                <TbChevronRight size={16} />
              </button>
              <button
                aria-label="Minimize to card"
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-black/20 text-white/60 transition-colors hover:bg-black/30 hover:text-white"
                onClick={() => setFullModalOpen(false)}
                type="button"
              >
                <TbMinimize size={16} />
              </button>
              <button
                aria-label="Close"
                className="ml-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-black/20 text-white/60 transition-colors hover:bg-black/30 hover:text-white"
                onClick={closeAll}
                type="button"
              >
                <TbX size={16} />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  )
}

function SidebarStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col">
      <span className="text-white/50 text-xs xl:text-sm">{label}</span>
      <span className="font-medium text-white text-sm xl:text-base">{value}</span>
    </div>
  )
}
