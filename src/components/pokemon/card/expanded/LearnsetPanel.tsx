import { AnimatePresence, motion } from 'motion/react'
import { Fragment, useState } from 'react'

import type { LevelUpMove, Move, PokemonEntry } from '@/lib/types'

import { getTypeColor } from '@/lib/pokemon'

import {
  MetaLabel,
  PANEL_BADGE_TEXT,
  PANEL_BODY_TEXT,
  TabPanelContent
} from './shared'

const CATEGORY_STYLES: Record<string, string> = {
  physical: 'bg-orange-500/30 text-orange-300',
  special: 'bg-indigo-500/30 text-indigo-300',
  status: 'bg-white/10 text-white/40'
}

const CATEGORY_LABELS: Record<string, string> = {
  physical: 'Phys',
  special: 'Spec',
  status: 'Stat'
}

export function LearnsetPanel({ pokemon }: { pokemon: PokemonEntry | undefined }) {
  if (!pokemon) {
    return (
      <TabPanelContent>
        <div className="animate-pulse space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div className="h-5 rounded bg-white/10" key={i} />
          ))}
        </div>
      </TabPanelContent>
    )
  }

  const { learnset } = pokemon

  if (!learnset) {
    return (
      <TabPanelContent>
        <p className="text-white/30 text-xs">Loading...</p>
      </TabPanelContent>
    )
  }

  return (
    <TabPanelContent className="flex flex-col gap-4">
      {learnset.levelUp.length > 0 && (
        <div>
          <div className="mb-1.5">
            <MetaLabel>Level Up</MetaLabel>
          </div>
          <MoveTable moves={learnset.levelUp} showLevel />
        </div>
      )}

      {learnset.egg.length > 0 && (
        <div>
          <div className="mb-1.5">
            <MetaLabel>Egg Moves</MetaLabel>
          </div>
          <MoveTable moves={learnset.egg} />
        </div>
      )}

      {learnset.machine.length > 0 && (
        <div>
          <div className="mb-1.5">
            <MetaLabel>TM / Tutor</MetaLabel>
          </div>
          <MoveTable moves={learnset.machine} />
        </div>
      )}

      {pokemon.gigantamax?.gmaxMoves && pokemon.gigantamax.gmaxMoves.length > 0 && (
        <div>
          <div className="mb-1.5">
            <MetaLabel>G-Max Moves</MetaLabel>
          </div>
          <MoveTable moves={pokemon.gigantamax.gmaxMoves} />
        </div>
      )}
    </TabPanelContent>
  )
}

export function MoveTable({
  moves,
  showLevel
}: {
  moves: LevelUpMove[] | Move[]
  showLevel?: boolean
}) {
  const [expandedMove, setExpandedMove] = useState<null | string>(null)

  return (
    <div className="overflow-x-auto">
      <table className={`w-full border-collapse ${PANEL_BODY_TEXT}`}>
        <thead>
          <tr className="text-left text-white/40">
            {showLevel && <th className={`w-7 pb-1 pr-2 font-medium ${PANEL_BADGE_TEXT}`}>Lv</th>}
            <th className="pb-1 pr-2 font-medium">Move</th>
            <th className="pb-1 pr-2 font-medium">Type</th>
            <th className="pb-1 pr-2 font-medium">Cat</th>
            <th className="pb-1 pr-1 font-medium text-right">Pwr</th>
            <th className="pb-1 pr-1 font-medium text-right">Acc</th>
            <th className="pb-1 font-medium text-right">PP</th>
          </tr>
        </thead>
        <tbody>
          {moves.map(move => (
            <Fragment key={move.name}>
              <tr
                className="border-t border-white/5 hover:bg-white/5 transition-colors cursor-pointer"
                onClick={() =>
                  setExpandedMove(expandedMove === move.name ? null : move.name)
                }
              >
                {showLevel && (
                  <td className="py-1 pr-2 font-mono tabular-nums text-white/40">
                    {(move as LevelUpMove).level}
                  </td>
                )}
                <td className="py-1 pr-2 font-medium text-white whitespace-nowrap">
                  {formatMoveName(move.name)}
                </td>
                <td className="py-1 pr-2">
                  <span
                    className={`inline-block rounded-full px-1.5 py-px font-medium text-white ${getTypeColor(move.type)} ${PANEL_BADGE_TEXT}`}
                  >
                    {move.type}
                  </span>
                </td>
                <td className="py-1 pr-2">
                  <span
                    className={`inline-block rounded px-1 py-px font-medium ${CATEGORY_STYLES[move.category] ?? CATEGORY_STYLES.status} ${PANEL_BADGE_TEXT}`}
                  >
                    {CATEGORY_LABELS[move.category] ?? move.category}
                  </span>
                </td>
                <td className="py-1 pr-1 text-right font-mono tabular-nums text-white/80">
                  {move.power ?? '—'}
                </td>
                <td className="py-1 pr-1 text-right font-mono tabular-nums text-white/80">
                  {move.accuracy ?? '—'}
                </td>
                <td className="py-1 text-right font-mono tabular-nums text-white/50">
                  {move.pp}
                </td>
              </tr>
              <AnimatePresence>
                {expandedMove === move.name && (move.shortEffect || move.effect) && (
                  <tr className="bg-white/5">
                    <td className="border-t border-white/5" colSpan={showLevel ? 7 : 6}>
                      <motion.div
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        initial={{ height: 0, opacity: 0 }}
                        style={{ overflow: 'hidden' }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                      >
                        <div className="px-1 py-1.5 leading-snug text-xs">
                          {move.shortEffect && (
                            <p className="text-white/60">{move.shortEffect}</p>
                          )}
                          {move.effect && move.effect !== move.shortEffect && (
                            <p className="mt-1 text-white/35">{move.effect}</p>
                          )}
                        </div>
                      </motion.div>
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function formatMoveName(name: string) {
  return name
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}
