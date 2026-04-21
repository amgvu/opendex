import { Tabs } from '@heroui/react'
import { AnimatePresence, motion, useDragControls } from 'motion/react'
import Image from 'next/image'
import { type CSSProperties, type RefObject, useEffect, useState } from 'react'
import { TbArrowsDiagonal } from 'react-icons/tb'

import type { PokemonEntry } from '@/types/pokemon'

import { useCardContext } from '@/context/card'
import { useNavContext } from '@/context/navigation'
import { CARD_TRANSITION } from '@/lib/constants'
import { bgClassToVar, getTypeColor } from '@/lib/pokemon'
import { useSelectionStore } from '@/stores/selectionStore'

import { FullModal } from '../full'
import { BattlePanel } from './BattlePanel'
import { BioPanel } from './BioPanel'
import { CardArtwork } from './CardArtwork'
import { CardHeader } from './CardHeader'
import { EvolutionPanel } from './EvolutionPanel'
import { LearnsetPanel } from './LearnsetPanel'
import { StatsPanel } from './StatsPanel'

const TABS_ENTER_TRANSITION = { delay: 0.15, duration: 0.2 }

const TAB_PANEL_SCROLL =
  'flex-1 min-h-0 overflow-x-hidden overflow-y-auto overscroll-contain [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-black/30 [mask-image:linear-gradient(to_bottom,transparent,black_1%,black_99%,transparent)]'

export function ExpandedCard({
  active,
  id,
  onExitComplete,
  pokemon,
  ref
}: {
  active: boolean
  id: string
  onExitComplete: () => void
  pokemon: PokemonEntry
  ref: RefObject<HTMLDivElement | null>
}) {
  const typeColor = getTypeColor(pokemon.types[0] ?? '')
  const dragControls = useDragControls()
  const bst =
    pokemon.hp +
    pokemon.attack +
    pokemon.defense +
    pokemon.specialAttack +
    pokemon.specialDefense +
    pokemon.speed
  const { activeTab, fullModalOpen, setActiveTab, setFullModalOpen } =
    useCardContext()
  const { onNext, onPrev } = useNavContext()
  const [dragging, setDragging] = useState(false)

  useEffect(
    () => () => {
      if (!useSelectionStore.getState().selectedName) setFullModalOpen(false)
    },
    [setFullModalOpen]
  )

  return (
    <AnimatePresence onExitComplete={onExitComplete}>
      {active && (
        <>
          <div className="fixed inset-0 z-50 grid place-items-center p-4">
            <motion.div
              className={`relative aspect-[63/88] max-h-[90svh] w-full max-w-md xl:max-w-xl 2xl:max-w-2xl [clip-path:inset(0_round_1rem)] ${typeColor} before:content-[''] before:absolute before:inset-0 before:bg-black/25 before:rounded-[1rem] before:pointer-events-none`}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragControls={dragControls}
              dragElastic={0.1}
              dragListener={false}
              layoutId={`card-${pokemon.name}-${id}`}
              onDragEnd={(_, info) => {
                setDragging(false)
                if (info.offset.x < -50) onNext()
                else if (info.offset.x > 50) onPrev()
              }}
              onDragStart={() => setDragging(true)}
              ref={ref}
              style={{
                filter: `drop-shadow(0 25px 50px color-mix(in oklab, ${bgClassToVar(typeColor)}, black 40%))`
              }}
              transition={CARD_TRANSITION}
            >
              <button
                aria-label="Open full view"
                className="absolute bottom-8 right-8 z-10 hidden cursor-pointer items-center justify-center text-white/30 transition-colors hover:text-white/60 sm:flex"
                data-no-drag
                onClick={() => setFullModalOpen(true)}
                type="button"
              >
                <TbArrowsDiagonal size={14} />
              </button>
              <Image
                alt=""
                aria-hidden="true"
                className="absolute bottom-42 sm:bottom-54 right-24 sm:right-52 h-[512px] w-[512px] scale-[2] origin-top-left opacity-10 grayscale"
                height={512}
                loading="eager"
                src={`/icons/${(pokemon.types[0] ?? 'normal').toLowerCase()}.svg`}
                unoptimized
                width={512}
              />
              <div
                className={`relative flex h-full cursor-grab flex-col px-4.5 pt-4.5 pb-3 sm:p-6 2xl:p-7 active:cursor-grabbing ${dragging ? 'select-none' : 'select-text'}`}
                onPointerDown={e => {
                  if (!(e.target as Element).closest('[data-no-drag]')) {
                    dragControls.start(e)
                  }
                }}
              >
                <CardHeader id={id} pokemon={pokemon} />
                {pokemon.officialUrl && (
                  <CardArtwork
                    id={id}
                    pokemon={pokemon}
                    typeColor={typeColor}
                  />
                )}
                <motion.div
                  animate={{ opacity: fullModalOpen ? 0 : 1 }}
                  className="flex min-h-0 flex-1 flex-col cursor-auto"
                  data-no-drag
                  exit={{ opacity: 0 }}
                  initial={{ opacity: 0 }}
                  transition={
                    fullModalOpen ? CARD_TRANSITION : TABS_ENTER_TRANSITION
                  }
                >
                  <Tabs
                    className="flex min-h-0 flex-1 flex-col"
                    onSelectionChange={key =>
                      setActiveTab(
                        key as 'battle' | 'bio' | 'evo' | 'moves' | 'stats'
                      )
                    }
                    selectedKey={activeTab}
                    style={
                      {
                        '--accent': bgClassToVar(typeColor),
                        '--border': 'rgba(255,255,255,0.25)',
                        '--foreground': 'white',
                        '--muted': 'rgba(255,255,255,0.5)'
                      } as CSSProperties
                    }
                    variant="secondary"
                  >
                    <Tabs.ListContainer>
                      <Tabs.List aria-label="Pokemon info">
                        <Tabs.Tab
                          className="text-xs sm:text-sm"
                          id="stats"
                        >
                          Stats
                          <Tabs.Indicator />
                        </Tabs.Tab>
                        <Tabs.Tab
                          className="text-xs sm:text-sm"
                          id="battle"
                        >
                          Battle
                          <Tabs.Indicator />
                        </Tabs.Tab>
                        <Tabs.Tab
                          className="text-xs sm:text-sm"
                          id="bio"
                        >
                          Bio
                          <Tabs.Indicator />
                        </Tabs.Tab>
                        <Tabs.Tab
                          className="text-xs sm:text-sm"
                          id="moves"
                        >
                          Moves
                          <Tabs.Indicator />
                        </Tabs.Tab>
                        <Tabs.Tab
                          className="text-xs sm:text-sm"
                          id="evo"
                        >
                          Evol
                          <Tabs.Indicator />
                        </Tabs.Tab>
                      </Tabs.List>
                    </Tabs.ListContainer>
                    <Tabs.Panel
                      className={`${TAB_PANEL_SCROLL} pt-2 sm:pt-3 text-xs sm:text-sm`}
                      id="stats"
                    >
                      {activeTab === 'stats' && (
                        <StatsPanel bst={bst} pokemon={pokemon} />
                      )}
                    </Tabs.Panel>
                    <Tabs.Panel
                      className={`${TAB_PANEL_SCROLL} pt-2 sm:pt-3 text-xs sm:text-sm`}
                      id="battle"
                    >
                      {activeTab === 'battle' && (
                        <BattlePanel pokemon={pokemon} />
                      )}
                    </Tabs.Panel>
                    <Tabs.Panel
                      className={`${TAB_PANEL_SCROLL} pt-2 sm:pt-3 text-xs sm:text-sm`}
                      id="bio"
                    >
                      {activeTab === 'bio' && <BioPanel pokemon={pokemon} />}
                    </Tabs.Panel>
                    <Tabs.Panel
                      className={`${TAB_PANEL_SCROLL} pt-2 sm:pt-3`}
                      id="moves"
                    >
                      {activeTab === 'moves' && (
                        <LearnsetPanel pokemon={pokemon} />
                      )}
                    </Tabs.Panel>
                    <Tabs.Panel
                      className={`${TAB_PANEL_SCROLL} pt-2 sm:pt-3`}
                      id="evo"
                    >
                      {activeTab === 'evo' && (
                        <EvolutionPanel pokemon={pokemon} />
                      )}
                    </Tabs.Panel>
                  </Tabs>
                </motion.div>
              </div>
            </motion.div>
          </div>
          <FullModal id={id} pokemon={pokemon} />
        </>
      )}
    </AnimatePresence>
  )
}
