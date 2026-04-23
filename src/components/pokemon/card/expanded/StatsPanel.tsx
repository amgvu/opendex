import type { Pokemon } from '@/types/pokemon'

import { InfoStat, PANEL_BODY_TEXT, TabPanelContent } from './shared'
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
  return (
    <TabPanelContent>
      <div className="flex flex-col gap-2 sm:gap-3">
        <div className={`flex items-center justify-between ${PANEL_BODY_TEXT}`}>
          <span className="font-medium text-white/50">Base Stats</span>
          <span className="font-medium text-white/50">
            BST <span className="font-bold font-mono tabular-nums text-white">{bst}</span>
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:gap-4">
          <div className="flex flex-col gap-0.5 sm:flex-1">
            <StatBar label="HP" value={pokemon.hp} />
            <StatBar label="Attack" value={pokemon.attack} />
            <StatBar label="Defense" value={pokemon.defense} />
            <StatBar label="Sp. Atk" value={pokemon.specialAttack} />
            <StatBar label="Sp. Def" value={pokemon.specialDefense} />
            <StatBar label="Speed" value={pokemon.speed} />
          </div>
          <div className="mt-1 h-28 sm:mt-0 sm:h-auto sm:w-28 xl:w-36 2xl:w-40 flex items-center justify-center">
            <StatRadar pokemon={pokemon} />
          </div>
        </div>

        <div className={`grid grid-cols-3 gap-2 sm:gap-2.5 ${PANEL_BODY_TEXT}`}>
          <InfoStat label="Height" value={`${pokemon.height.toFixed(1)}m`} />
          <InfoStat label="Weight" value={`${pokemon.weight.toFixed(1)} lbs`} />
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
        </div>
      </div>
    </TabPanelContent>
  )
}
