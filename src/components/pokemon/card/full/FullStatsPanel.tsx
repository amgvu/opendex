import type { Pokemon } from '@/types/pokemon'

import { StatBar } from '../expanded/StatBar'
import { StatRadar } from '../expanded/StatRadar'
import { InfoStat, TabPanelContent } from '../expanded/shared'

const GROWTH_RATE_LABELS: Record<string, string> = {
  erratic: 'Erratic',
  fast: 'Fast',
  fluctuating: 'Fluctuating',
  'medium-fast': 'Med. Fast',
  'medium-slow': 'Med. Slow',
  slow: 'Slow'
}

export function FullStatsPanel({ bst, pokemon }: { bst: number; pokemon: Pokemon }) {
  return (
    <TabPanelContent>
      <div className="flex items-center justify-between mb-4">
        <span className="font-medium text-white/50">Base Stats</span>
        <span className="text-white/50 font-medium">
          BST <span className="font-bold text-white">{bst}</span>
        </span>
      </div>

      <div className="flex gap-8 items-start">
        {/* Left: bars + info stats nested below */}
        <div className="flex flex-1 flex-col gap-5">
          <div className="flex flex-col gap-0.5">
            <StatBar label="HP" value={pokemon.hp} />
            <StatBar label="Attack" value={pokemon.attack} />
            <StatBar label="Defense" value={pokemon.defense} />
            <StatBar label="Sp. Atk" value={pokemon.specialAttack} />
            <StatBar label="Sp. Def" value={pokemon.specialDefense} />
            <StatBar label="Speed" value={pokemon.speed} />
          </div>

          <div className="grid grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-3">
            <InfoStat label="Height" value={`${pokemon.height.toFixed(1)} m`} />
            <InfoStat label="Weight" value={`${pokemon.weight.toFixed(1)} lbs`} />
            <InfoStat label="Generation" value={`Gen ${pokemon.generation}`} />
            {pokemon.growthRate && (
              <InfoStat
                label="Growth Rate"
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
              <InfoStat label="Friendship" value={`${pokemon.baseFriendship} / 255`} />
            )}
          </div>
        </div>

        {/* Right: radar chart alongside bars */}
        <div className="w-52 xl:w-60 2xl:w-72 shrink-0 flex items-center justify-center">
          <StatRadar pokemon={pokemon} />
        </div>
      </div>
    </TabPanelContent>
  )
}
