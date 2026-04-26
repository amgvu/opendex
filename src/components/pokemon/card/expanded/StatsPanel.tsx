import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'

import type { PokemonEntry } from '@/lib/types'

import { EV_STAT_LABELS, getTypeColor, getTypeMatchups } from '@/lib/pokemon'

import {
  InfoStat,
  PANEL_BADGE_TEXT,
  PANEL_BODY_TEXT,
  PANEL_CHIP_TEXT,
  SectionLabel,
  TabPanelContent
} from './shared'
import { StatBar } from './StatBar'
import { StatRadar } from './StatRadar'

const GROWTH_RATE_LABELS: Record<string, string> = {
  erratic: 'Erratic',
  fast: 'Fast',
  fluctuating: 'Fluctuating',
  'medium-fast': 'Med. Fast',
  'medium-slow': 'Med. Slow',
  slow: 'Slow'
}

function StatsPanelSkeleton() {
  return (
    <TabPanelContent>
      <div className="animate-pulse flex flex-col gap-2 sm:gap-3">
        <div className="flex items-center justify-between">
          <div className="h-4 w-20 rounded bg-white/10" />
          <div className="h-4 w-16 rounded bg-white/10" />
        </div>
        <div className="flex flex-row gap-4">
          <div className="flex flex-col flex-1 gap-1.5">
            {(['w-8', 'w-12', 'w-14', 'w-14', 'w-14', 'w-10'] as const).map((w, i) => (
              <div className="flex items-center gap-2 sm:gap-3" key={i}>
                <div className={`h-3.5 ${w} shrink-0 rounded bg-white/10`} />
                <div className="h-3.5 w-6 shrink-0 rounded bg-white/10" />
                <div className="h-2 flex-1 rounded-full bg-white/10" />
              </div>
            ))}
          </div>
          <div className="w-28 xl:w-36 2xl:w-40 shrink-0 flex items-center justify-center">
            <div className="h-24 w-24 rounded-full bg-white/10" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div className="flex flex-col gap-1" key={i}>
              <div className="h-3 w-10 rounded bg-white/10" />
              <div className="h-4 w-16 rounded bg-white/10" />
            </div>
          ))}
        </div>
      </div>
    </TabPanelContent>
  )
}

export function StatsPanel({
  bst,
  pokemon
}: {
  bst: number
  pokemon: PokemonEntry | undefined
}) {
  if (!pokemon) return <StatsPanelSkeleton />

  const { immunities, resistances, weaknesses } =
    pokemon.typeMatchups ?? getTypeMatchups(pokemon.types)
  const [expandedAbility, setExpandedAbility] = useState<null | string>(null)

  return (
    <TabPanelContent>
      <div className="flex flex-col gap-2 sm:gap-3">
        <div className={`flex items-center justify-between ${PANEL_BODY_TEXT}`}>
          <span className="font-medium text-white/50">Base Stats</span>
          <span className="font-medium text-white/50">
            BST <span className="font-bold font-mono tabular-nums text-white">{bst}</span>
          </span>
        </div>

        <div className="flex flex-row gap-4">
          <div className="flex flex-col flex-1">
            <StatBar label="HP" value={pokemon.hp} />
            <StatBar label="Attack" value={pokemon.attack} />
            <StatBar label="Defense" value={pokemon.defense} />
            <StatBar label="Sp. Atk" value={pokemon.specialAttack} />
            <StatBar label="Sp. Def" value={pokemon.specialDefense} />
            <StatBar label="Speed" value={pokemon.speed} />
          </div>
          <div className="w-28 xl:w-36 2xl:w-40 shrink-0 flex items-center justify-center">
            <StatRadar pokemon={pokemon} />
          </div>
        </div>

        <div className={`grid grid-cols-3 gap-2 sm:gap-2.5 ${PANEL_BODY_TEXT}`}>
          <InfoStat
            label="Height"
            value={
              pokemon.heightM != null
                ? `${pokemon.heightFt} / ${pokemon.heightM.toFixed(1)}m`
                : '—'
            }
          />
          <InfoStat
            label="Weight"
            value={
              pokemon.weightKg != null
                ? `${pokemon.weightLbs.toFixed(1)} lbs / ${pokemon.weightKg.toFixed(1)} kg`
                : '—'
            }
          />
          <InfoStat label="Gen" value={pokemon.generation} />
          {pokemon.growthRate && (
            <InfoStat
              label="Growth"
              mono={false}
              value={
                <span className="capitalize">
                  {GROWTH_RATE_LABELS[pokemon.growthRate] ??
                    pokemon.growthRate.replace(/-/g, ' ')}
                </span>
              }
            />
          )}
          {pokemon.baseExperience !== undefined && (
            <InfoStat label="Base Exp" value={pokemon.baseExperience} />
          )}
          {pokemon.baseFriendship !== undefined && (
            <InfoStat
              label="Friendship"
              value={`${pokemon.baseFriendship} / 255`}
            />
          )}
          {pokemon.catchRate !== undefined && (
            <InfoStat
              label="Catch Rate"
              value={`${Math.round((pokemon.catchRate / 255) * 100)}%`}
            />
          )}
        </div>

        {pokemon.evYield && pokemon.evYield.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="w-16 shrink-0 whitespace-nowrap">
              <SectionLabel>EV Yield</SectionLabel>
            </span>
            <div className="flex flex-nowrap -ml-4 sm:ml-2 gap-1.5">
              {pokemon.evYield.map(({ stat, value }) => (
                <span
                  className={`whitespace-nowrap rounded-full bg-white/15 px-2.5 py-0.5 font-medium text-white ${PANEL_CHIP_TEXT}`}
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
            <SectionLabel>Abilities</SectionLabel>
            <div className="flex flex-col gap-1.5">
              {pokemon.abilities.map(a => (
                <div
                  className="rounded-lg bg-white/10 px-3 py-2 cursor-pointer transition-colors hover:bg-white/15"
                  key={a.name}
                  onClick={() =>
                    setExpandedAbility(expandedAbility === a.name ? null : a.name)
                  }
                >
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium capitalize text-white">
                      {a.name}
                    </span>
                    {a.isHidden && (
                      <span className={`${PANEL_BADGE_TEXT} text-white/50`}>
                        HA
                      </span>
                    )}
                  </div>
                  {a.description && (
                    <p
                      className={`mt-0.5 text-white/60 leading-snug ${PANEL_BODY_TEXT}`}
                    >
                      {a.description}
                    </p>
                  )}
                  <AnimatePresence>
                    {expandedAbility === a.name && a.longEffect && (
                      <motion.div
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        initial={{ height: 0, opacity: 0 }}
                        style={{ overflow: 'hidden' }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                      >
                        <p
                          className={`mt-1.5 border-t border-white/10 pt-1.5 text-white/40 leading-snug ${PANEL_BODY_TEXT}`}
                        >
                          {a.longEffect}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        )}

        {(weaknesses.length > 0 || resistances.length > 0 || immunities.length > 0) && (
          <div className="flex flex-col gap-3">
            <div className="min-w-0">
              <div className="mb-1.5 block">
                <SectionLabel>Weak</SectionLabel>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {weaknesses.map(({ multiplier, type }) => (
                  <span className="relative inline-flex" key={type}>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-medium capitalize text-white/90 ${getTypeColor(type)} ${PANEL_CHIP_TEXT}`}
                    >
                      {type}
                    </span>
                    <span
                      className={`absolute -right-1.5 -top-1.5 flex min-w-4 h-4 px-1 items-center justify-center rounded-full bg-black/80 font-bold leading-none text-white ${PANEL_BADGE_TEXT}`}
                    >
                      ×{multiplier}
                    </span>
                  </span>
                ))}
              </div>
            </div>
            <div className="min-w-0">
              <div className="mb-1.5 block">
                <SectionLabel>Resist</SectionLabel>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {resistances.length > 0 ? (
                  resistances.map(({ multiplier, type }) => (
                    <span className="relative inline-flex" key={type}>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-medium capitalize text-white ${getTypeColor(type)} ${PANEL_CHIP_TEXT}`}
                      >
                        {type}
                      </span>
                      <span
                        className={`absolute -right-1.5 -top-1.5 flex min-w-4 h-4 px-1 items-center justify-center rounded-full bg-black/80 font-bold leading-none text-white ${PANEL_BADGE_TEXT}`}
                      >
                        {multiplier === 0.25 ? '¼' : '½'}
                      </span>
                    </span>
                  ))
                ) : (
                  <span className="text-white/30">—</span>
                )}
              </div>
            </div>
            <div className="min-w-0">
              <div className="mb-1.5 block">
                <SectionLabel>Immune</SectionLabel>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {immunities.length > 0 ? (
                  immunities.map(type => (
                    <span
                      className={`rounded-full px-2.5 py-0.5 font-medium capitalize text-white/40 ${getTypeColor(type)} ${PANEL_CHIP_TEXT}`}
                      key={type}
                    >
                      {type}
                    </span>
                  ))
                ) : (
                  <span className="text-white/30">—</span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </TabPanelContent>
  )
}
