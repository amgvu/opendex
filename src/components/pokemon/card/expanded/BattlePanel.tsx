import type { Pokemon } from '@/types/pokemon'

import { EV_STAT_LABELS, getTypeColor, getTypeMatchups } from '@/lib/pokemon'

import { TabPanelContent } from './shared'

export function BattlePanel({ pokemon }: { pokemon: Pokemon }) {
  const { immunities, resistances, weaknesses } = getTypeMatchups(pokemon.types)

  return (
    <TabPanelContent className="space-y-1.5 sm:space-y-2">
      {pokemon.evYield && pokemon.evYield.length > 0 && (
        <div className="flex items-center gap-2">
          <span className="w-16 shrink-0 whitespace-nowrap text-white/70">
            EV Yield
          </span>
          <div className="flex flex-nowrap gap-1.5">
            {pokemon.evYield.map(({ stat, value }) => (
              <span
                className="whitespace-nowrap rounded-full bg-white/15 px-2.5 py-0.5 text-xs xl:text-sm 2xl:text-base font-medium text-white"
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
          <span className="text-white/70">Abilities</span>
          <div className="flex flex-col gap-1.5">
            {pokemon.abilities.map(a => (
              <div className="rounded-lg bg-white/10 px-3 py-2" key={a.name}>
                <div className="flex items-center gap-1.5">
                  <span className="font-medium capitalize text-white">
                    {a.name}
                  </span>
                  {a.isHidden && (
                    <span className="text-[10px] text-white/50">HA</span>
                  )}
                </div>
                {a.description && (
                  <p className="mt-0.5 text-xs xl:text-sm 2xl:text-base text-white/60 leading-snug">
                    {a.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      {(weaknesses.length > 0 ||
        resistances.length > 0 ||
        immunities.length > 0) && (
        <div className="flex flex-col gap-2">
          <div className="min-w-0">
            <span className="mb-1 block text-white/60">Weak</span>
            <div className="flex flex-wrap gap-1">
              {weaknesses.map(({ multiplier, type }) => (
                <span className="relative inline-flex" key={type}>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs xl:text-sm 2xl:text-base font-medium capitalize text-white/90 ${getTypeColor(type)}`}
                  >
                    {type}
                  </span>
                  <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-black/80 text-[9px] font-bold text-white leading-none">
                    ×{multiplier}
                  </span>
                </span>
              ))}
            </div>
          </div>
          <div className="min-w-0">
            <span className="mb-1 block text-white/60">Resist</span>
            <div className="flex flex-wrap gap-1">
              {resistances.length > 0 ? (
                resistances.map(({ multiplier, type }) => (
                  <span className="relative inline-flex" key={type}>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs xl:text-sm 2xl:text-base font-medium capitalize text-white ${getTypeColor(type)}`}
                    >
                      {type}
                    </span>
                    <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-black/80 text-[9px] font-bold text-white leading-none">
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
            <span className="mb-1 block text-white/60">Immune</span>
            <div className="flex flex-wrap gap-1">
              {immunities.length > 0 ? (
                immunities.map(type => (
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs xl:text-sm 2xl:text-base font-medium capitalize text-white/40 ${getTypeColor(type)}`}
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
    </TabPanelContent>
  )
}
