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

export function BattlePanel({ pokemon }: { pokemon: PokemonEntry }) {
  const { immunities, resistances, weaknesses } =
    pokemon.typeMatchups ?? getTypeMatchups(pokemon.types)

  return (
    <TabPanelContent className="flex flex-col gap-1.5 sm:gap-2">
      <div className={`grid grid-cols-2 gap-x-4 gap-y-1.5 ${PANEL_BODY_TEXT}`}>
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
              <div className="rounded-lg bg-white/10 px-3 py-2" key={a.name}>
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
              </div>
            ))}
          </div>
        </div>
      )}
      {(weaknesses.length > 0 ||
        resistances.length > 0 ||
        immunities.length > 0) && (
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
    </TabPanelContent>
  )
}
