import type { Pokemon } from '@/types/pokemon'

import { InfoStat, TabPanelContent } from './shared'
import { StatBar } from './StatBar'

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
  return (
    <TabPanelContent>
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center gap-3 text-xs sm:text-sm xl:text-base 2xl:text-lg mb-2">
          <span className="w-16 sm:w-20 xl:w-24 2xl:w-28 shrink-0 font-medium text-white/50">
            Base Stats
          </span>
          <span className="w-7 sm:w-8 shrink-0" />
          <div className="flex-1 flex justify-end">
            <span className="text-white/50 font-medium">
              BST <span className="font-bold text-white">{bst}</span>
            </span>
          </div>
        </div>
        <StatBar label="HP" value={pokemon.hp} />
        <StatBar label="Attack" value={pokemon.attack} />
        <StatBar label="Defense" value={pokemon.defense} />
        <StatBar label="Sp. Atk" value={pokemon.specialAttack} />
        <StatBar label="Sp. Def" value={pokemon.specialDefense} />
        <StatBar label="Speed" value={pokemon.speed} />
        <div className="grid grid-cols-3 gap-2 mt-2">
          <InfoStat label="Height" value={`${pokemon.height.toFixed(1)}m`} />
          <InfoStat label="Weight" value={`${pokemon.weight.toFixed(1)} lbs`} />
          <InfoStat label="Gen" value={pokemon.generation} />
          {pokemon.catchRate !== undefined && (
            <InfoStat
              label="Catch"
              value={`${Math.round((pokemon.catchRate / 255) * 100)}%`}
            />
          )}
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
        </div>
      </div>
    </TabPanelContent>
  )
}
