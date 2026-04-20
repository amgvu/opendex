import type { Pokemon } from '@/types/pokemon'

import { EV_STAT_LABELS, getTypeColor, getTypeMatchups } from '@/lib/pokemon'

import { InfoStat, TabPanelContent } from '../expanded/shared'

export function FullBattlePanel({ pokemon }: { pokemon: Pokemon }) {
  const { immunities, resistances, weaknesses } =
    pokemon.typeMatchups ?? getTypeMatchups(pokemon.types)

  return (
    <TabPanelContent className="flex gap-8">
      {/* LEFT: meta + abilities */}
      <div className="flex w-[42%] shrink-0 flex-col gap-4">
        <div className="flex flex-col gap-2">
          {pokemon.catchRate !== undefined && (
            <InfoStat
              label="Catch Rate"
              value={`${Math.round((pokemon.catchRate / 255) * 100)}%`}
            />
          )}
          {pokemon.evYield && pokemon.evYield.length > 0 && (
            <div className="flex flex-col gap-1">
              <span className="text-white/60">EV Yield</span>
              <div className="flex flex-wrap gap-1.5">
                {pokemon.evYield.map(({ stat, value }) => (
                  <span
                    className="whitespace-nowrap rounded-full bg-white/15 px-2.5 py-0.5 text-sm font-medium text-white"
                    key={stat}
                  >
                    +{value} {EV_STAT_LABELS[stat] ?? stat}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {pokemon.abilities && pokemon.abilities.length > 0 && (
          <div className="flex flex-col gap-2">
            <span className="text-white/60">Abilities</span>
            <div className="flex flex-col gap-2">
              {pokemon.abilities.map(a => (
                <div className="rounded-lg bg-white/10 px-3 py-2.5" key={a.name}>
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium capitalize text-white">{a.name}</span>
                    {a.isHidden && (
                      <span className="text-[10px] text-white/50">HA</span>
                    )}
                  </div>
                  {a.description && (
                    <p className="mt-1 text-sm text-white/60 leading-snug">
                      {a.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* RIGHT: type matchups */}
      <div className="flex flex-1 flex-col gap-4">
        <MatchupRow
          entries={weaknesses.map(({ multiplier, type }) => (
            <span className="relative inline-flex" key={type}>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-sm font-medium capitalize text-white/90 ${getTypeColor(type)}`}
              >
                {type}
              </span>
              <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-black/80 text-[9px] font-bold text-white leading-none">
                ×{multiplier}
              </span>
            </span>
          ))}
          label="Weak to"
        />
        <MatchupRow
          entries={
            resistances.length > 0
              ? resistances.map(({ multiplier, type }) => (
                  <span className="relative inline-flex" key={type}>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-sm font-medium capitalize text-white ${getTypeColor(type)}`}
                    >
                      {type}
                    </span>
                    <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-black/80 text-[9px] font-bold text-white leading-none">
                      {multiplier === 0.25 ? '¼' : '½'}
                    </span>
                  </span>
                ))
              : [<span className="text-white/30" key="none">—</span>]
          }
          label="Resistant"
        />
        <MatchupRow
          entries={
            immunities.length > 0
              ? immunities.map(type => (
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-sm font-medium capitalize text-white/40 ${getTypeColor(type)}`}
                    key={type}
                  >
                    {type}
                  </span>
                ))
              : [<span className="text-white/30" key="none">—</span>]
          }
          label="Immune"
        />
      </div>
    </TabPanelContent>
  )
}

function MatchupRow({ entries, label }: { entries: React.ReactNode[]; label: string }) {
  return (
    <div>
      <span className="mb-2 block text-white/60">{label}</span>
      <div className="flex flex-wrap gap-1.5">{entries}</div>
    </div>
  )
}
