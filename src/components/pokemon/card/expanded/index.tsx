import { Tabs } from '@heroui/react'
import { AnimatePresence, motion, useDragControls } from 'motion/react'
import Image from 'next/image'
import { type CSSProperties, type RefObject, useState } from 'react'
import { TbCheck, TbChevronUp, TbLink, TbX } from 'react-icons/tb'

import type { PokemonEntry } from '@/lib/types'

import { useNavContext } from '@/context/navigation'
import { useGifLoader } from '@/hooks/card/useGifLoader'
import { ARTWORK_COLLAPSE_TRANSITION, CARD_TRANSITION } from '@/lib/constants'
import { bgClassToVar, getTypeColor } from '@/lib/pokemon'
import { useCardStore } from '@/stores/cardStore'
import { useSelectionStore } from '@/stores/selectionStore'

import { ArtworkSwitches } from '../ArtworkSwitches'
import { BioPanel } from './BioPanel'
import { CardArtwork } from './CardArtwork'
import { CardHeader } from './CardHeader'
import { EvolutionPanel } from './EvolutionPanel'
import { LearnsetPanel } from './LearnsetPanel'
import { StatsPanel } from './StatsPanel'

const TABS_ENTER_TRANSITION = { delay: 0.15, duration: 0.2 }

const TAB_PANEL_SCROLL =
  'flex-1 min-h-0 overflow-x-hidden overflow-y-auto overscroll-contain [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-black/30 [mask-image:linear-gradient(to_bottom,transparent,black_1%,black_99%,transparent)]'

const TAB_PANEL_CLASSES = `${TAB_PANEL_SCROLL} pt-2 sm:pt-3 text-xs sm:text-sm xl:text-base`

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
  const {
    activeTab,
    artworkCollapsed,
    gifEnabled,
    gmaxEnabled,
    setActiveTab,
    setArtworkCollapsed,
    setGifEnabled,
    setGmaxEnabled,
    setShinyEnabled,
    shinyEnabled
  } = useCardStore()
  const { gifError, gifMounted, gifReady, setGifError, setGifReady } =
    useGifLoader(gifEnabled, shinyEnabled)
  const { onNext, onPrev } = useNavContext()
  const setSelectedName = useSelectionStore(s => s.setSelectedName)
  const [dragging, setDragging] = useState(false)
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    const url = `${window.location.origin}${window.location.pathname}?pokemon=${pokemon.name}`
    void navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <AnimatePresence onExitComplete={onExitComplete}>
      {active && (
        <div className="fixed inset-0 z-50 grid place-items-center p-0 sm:p-4">
          <motion.div
            className={`relative h-full w-full overflow-hidden sm:h-auto sm:aspect-[63/88] sm:max-h-[90svh] sm:max-w-md xl:max-w-xl 2xl:max-w-2xl [clip-path:none] sm:[clip-path:inset(0_round_1rem)] ${typeColor} before:content-[''] before:absolute before:inset-0 before:bg-black/25 before:rounded-none sm:before:rounded-[1rem] before:pointer-events-none`}
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
              className={`relative flex min-h-full sm:h-full cursor-grab flex-col px-4.5 pt-4.5 pb-3 sm:p-6 sm:pb-3 2xl:p-7 2xl:pb-3 active:cursor-grabbing ${dragging ? 'select-none' : 'select-text'}`}
              onPointerDown={e => {
                if (!(e.target as Element).closest('[data-no-drag]')) {
                  dragControls.start(e)
                }
              }}
            >
              <button
                aria-label="Close"
                className="absolute top-2 right-2 z-10 p-2 text-white/50 transition-colors hover:text-white sm:hidden"
                data-no-drag
                onClick={() => setSelectedName(null)}
                type="button"
              >
                <TbX size={24} />
              </button>

              <CardHeader id={id} pokemon={pokemon} />
              {pokemon.officialUrl && (
                <>
                  <motion.div
                    animate={{
                      height: artworkCollapsed ? 0 : 'auto',
                      opacity: artworkCollapsed ? 0 : 1
                    }}
                    initial={false}
                    style={{ overflow: 'hidden' }}
                    transition={ARTWORK_COLLAPSE_TRANSITION}
                  >
                    <CardArtwork
                      gifError={gifError}
                      gifMounted={gifMounted}
                      gifReady={gifReady}
                      id={id}
                      pokemon={pokemon}
                      setGifError={setGifError}
                      setGifReady={setGifReady}
                    />
                    <div
                      className="flex items-center justify-between pb-1 sm:pb-2"
                      data-no-drag
                    >
                      <button
                        className="flex cursor-pointer items-center gap-1 select-none text-xs font-medium text-white/70"
                        onClick={handleCopy}
                        type="button"
                      >
                        {copied ? <TbCheck size={16} /> : <TbLink size={16} />}
                        <span>{copied ? 'Copied!' : 'Copy link'}</span>
                      </button>
                      <div className="flex items-center gap-1.5">
                        <ArtworkSwitches
                          gifEnabled={gifEnabled}
                          gifError={gifError}
                          gmaxEnabled={gmaxEnabled}
                          hasGigantamax={!!pokemon.gigantamax}
                          pokemon={pokemon}
                          setGifEnabled={setGifEnabled}
                          setGmaxEnabled={setGmaxEnabled}
                          setShinyEnabled={setShinyEnabled}
                          shinyEnabled={shinyEnabled}
                        />
                      </div>
                    </div>
                  </motion.div>
                  <button
                    aria-label={
                      artworkCollapsed ? 'Show artwork' : 'Hide artwork'
                    }
                    className="flex w-full cursor-pointer items-center justify-center py-1 text-white/25 transition-colors hover:text-white/50"
                    data-no-drag
                    onClick={() => setArtworkCollapsed(!artworkCollapsed)}
                    type="button"
                  >
                    <TbChevronUp
                      className={`transition-transform duration-[250ms] ${artworkCollapsed ? 'rotate-180' : ''}`}
                      size={12}
                    />
                  </button>
                </>
              )}
              <motion.div
                animate={{ opacity: 1 }}
                className="flex min-h-0 sm:flex-1 flex-col cursor-auto max-h-[calc(100svh-1rem)] sm:max-h-none overflow-y-auto sm:overflow-y-visible"
                data-no-drag
                exit={{ opacity: 0 }}
                initial={{ opacity: 0 }}
                transition={TABS_ENTER_TRANSITION}
              >
                <Tabs
                  className="flex min-h-0 flex-1 flex-col"
                  onSelectionChange={key =>
                    setActiveTab(key as 'bio' | 'evo' | 'moves' | 'stats')
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
                        className="text-xs sm:text-sm xl:text-base"
                        id="stats"
                      >
                        Stats
                        <Tabs.Indicator />
                      </Tabs.Tab>
                      <Tabs.Tab
                        className="text-xs sm:text-sm xl:text-base"
                        id="bio"
                      >
                        Bio
                        <Tabs.Indicator />
                      </Tabs.Tab>
                      <Tabs.Tab
                        className="text-xs sm:text-sm xl:text-base"
                        id="moves"
                      >
                        Moves
                        <Tabs.Indicator />
                      </Tabs.Tab>
                      <Tabs.Tab
                        className="text-xs sm:text-sm xl:text-base"
                        id="evo"
                      >
                        Evol
                        <Tabs.Indicator />
                      </Tabs.Tab>
                    </Tabs.List>
                  </Tabs.ListContainer>
                  <Tabs.Panel className={TAB_PANEL_CLASSES} id="stats">
                    {activeTab === 'stats' && (
                      <StatsPanel bst={bst} pokemon={pokemon} />
                    )}
                  </Tabs.Panel>
                  <Tabs.Panel className={TAB_PANEL_CLASSES} id="bio">
                    {activeTab === 'bio' && <BioPanel pokemon={pokemon} />}
                  </Tabs.Panel>
                  <Tabs.Panel className={TAB_PANEL_CLASSES} id="moves">
                    {activeTab === 'moves' && (
                      <LearnsetPanel pokemon={pokemon} />
                    )}
                  </Tabs.Panel>
                  <Tabs.Panel className={TAB_PANEL_CLASSES} id="evo">
                    {activeTab === 'evo' && (
                      <EvolutionPanel pokemon={pokemon} />
                    )}
                  </Tabs.Panel>
                </Tabs>
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
