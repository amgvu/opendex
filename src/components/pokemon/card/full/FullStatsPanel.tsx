import type { Pokemon } from '@/types/pokemon'

import { InfoStat, TabPanelContent } from '../expanded/shared'
import { StatBar } from '../expanded/StatBar'
import { StatRadar } from '../expanded/StatRadar'

const GROWTH_RATE_LABELS: Record<string, string> = {
  erratic: 'Erratic',
  fast: 'Fast',
  fluctuating: 'Fluctuating',
  'medium-fast': 'Med. Fast',
  'medium-slow': 'Med. Slow',
  slow: 'Slow'
}

export function FullStatsPanel({
  bst,
  pokemon
}: {
  bst: number
  pokemon: Pokemon
}) {
  return (
    <TabPanelContent className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="font-medium text-white/50">Base Stats</span>
        <span className="text-white/50 font-medium">
          BST <span className="font-bold text-white">{bst}</span>
        </span>
      </div>

      {/* Radar — own section, centered */}
      <div className="h-64 xl:h-72 2xl:h-80 w-full flex items-center justify-center">
        <StatRadar pokemon={pokemon} />
      </div>

      {/* Bars + info stats below */}
      <div className="flex flex-col gap-5">
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
