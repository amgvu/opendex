import { AnimatePresence, motion } from 'motion/react'
import { TbChartBar, TbChartRadar } from 'react-icons/tb'

import type { Pokemon } from '@/types/pokemon'

import { useCardContext } from '@/context/card'

import { InfoStat, TabPanelContent } from './shared'
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

export function StatsPanel({
  bst,
  pokemon
}: {
  bst: number
  pokemon: Pokemon
}) {
  const { setStatsView, statsView } = useCardContext()

  return (
    <TabPanelContent>
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center gap-3 text-xs sm:text-sm xl:text-base 2xl:text-lg mb-2">
          <div className="flex items-center gap-1 shrink-0">
            <span className="font-medium text-white/50">Base Stats</span>
            <button
              aria-label={
                statsView === 'bars'
                  ? 'Switch to radar chart'
                  : 'Switch to bar chart'
              }
              className="rounded cursor-pointer p-0.5 text-white/35 hover:text-white/65 transition-colors"
              onClick={() =>
                setStatsView(statsView === 'bars' ? 'radar' : 'bars')
              }
              type="button"
            >
              {statsView === 'bars' ? (
                <TbChartRadar size={13} />
              ) : (
                <TbChartBar size={13} />
              )}
            </button>
          </div>
          <div className="flex-1 flex justify-end">
            <span className="text-white/50 font-medium">
              BST <span className="font-bold text-white">{bst}</span>
            </span>
          </div>
        </div>

        <AnimatePresence initial={false} mode="popLayout">
          {statsView === 'bars' ? (
            <motion.div
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              key="bars"
              transition={{ duration: 0.2 }}
            >
              <StatBar label="HP" value={pokemon.hp} />
              <StatBar label="Attack" value={pokemon.attack} />
              <StatBar label="Defense" value={pokemon.defense} />
              <StatBar label="Sp. Atk" value={pokemon.specialAttack} />
              <StatBar label="Sp. Def" value={pokemon.specialDefense} />
              <StatBar label="Speed" value={pokemon.speed} />
            </motion.div>
          ) : (
            <motion.div
              animate={{ opacity: 1 }}
              className="h-44 sm:h-52 xl:h-60 2xl:h-72 w-full flex items-center justify-center"
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              key="radar"
              transition={{ duration: 0.2 }}
            >
              <StatRadar pokemon={pokemon} />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-3 gap-2 mt-2">
          <InfoStat label="Height" value={`${pokemon.height.toFixed(1)}m`} />
          <InfoStat label="Weight" value={`${pokemon.weight.toFixed(1)} lbs`} />
          <InfoStat label="Gen" value={pokemon.generation} />
          {pokemon.growthRate && (
            <InfoStat
              label="Growth"
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
        </div>
      </div>
    </TabPanelContent>
  )
}
