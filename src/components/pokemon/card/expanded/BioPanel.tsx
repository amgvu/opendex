import type { PokemonEntry } from '@/lib/types'

import {
  InfoStat,
  MetaLabel,
  PANEL_BODY_TEXT,
  PANEL_CHIP_TEXT,
  TabPanelContent
} from './shared'

export function BioPanel({ pokemon }: { pokemon: PokemonEntry | undefined }) {
  if (!pokemon) return <BioPanelSkeleton />

  return (
    <TabPanelContent className="flex flex-col gap-2 sm:gap-3">
      {pokemon.genus && (
        <p className={`${PANEL_BODY_TEXT} italic text-white/50`}>
          {pokemon.genus}
        </p>
      )}
      <div className={`grid grid-cols-2 gap-x-4 gap-y-2 ${PANEL_BODY_TEXT}`}>
        {pokemon.habitat != null && (
          <InfoStat
            label="Habitat"
            mono={false}
            muted
            value={
              <span className="capitalize">
                {pokemon.habitat.replace(/-/g, ' ')}
              </span>
            }
          />
        )}
        {pokemon.color && (
          <InfoStat
            label="Color"
            mono={false}
            muted
            value={<span className="capitalize">{pokemon.color}</span>}
          />
        )}
        {pokemon.genderRate !== undefined && (
          <InfoStat
            label="Gender"
            muted
            value={formatGender(pokemon.genderRate)}
          />
        )}
        {pokemon.eggGroups && pokemon.eggGroups.length > 0 && (
          <InfoStat
            label="Egg Groups"
            mono={false}
            muted
            value={
              <span className="capitalize">{pokemon.eggGroups.map(g => g.replace(/(\D)(\d)/, '$1 $2')).join(', ')}</span>
            }
          />
        )}
        {pokemon.eggCycles !== undefined && (
          <InfoStat
            label="Egg Cycles"
            muted
            value={`${pokemon.eggCycles} cycles`}
          />
        )}
        {pokemon.shape && (
          <InfoStat
            label="Shape"
            mono={false}
            muted
            value={
              <span className="capitalize">
                {pokemon.shape.replace(/-/g, ' ')}
              </span>
            }
          />
        )}
      </div>
      <p className={`${PANEL_BODY_TEXT} text-white/70 leading-snug`}>
        {pokemon.description}
      </p>
      {pokemon.flavorTexts && pokemon.flavorTexts.length > 1 && (
        <div className="flex flex-col gap-2">
          {pokemon.flavorTexts.slice(1).map(({ game, text }) => (
            <div key={game}>
              <span className="text-[10px] uppercase tracking-wider text-white/30 capitalize sm:text-xs xl:text-sm">
                {game.replace(/-/g, ' ')}
              </span>
              <p className={`${PANEL_BODY_TEXT} text-white/50 leading-snug`}>
                {text}
              </p>
            </div>
          ))}
        </div>
      )}
      {pokemon.heldItems && pokemon.heldItems.length > 0 && (
        <div>
          <div className="mb-1">
            <MetaLabel>Wild Held Items</MetaLabel>
          </div>
          <div className="flex flex-col gap-1">
            {pokemon.heldItems.map(item => (
              <div className="flex items-center gap-1.5" key={item.name}>
                <span className={`${PANEL_BODY_TEXT} text-white/70`}>
                  {item.name}
                </span>
                <span className="font-mono tabular-nums text-xs text-white/35 sm:text-sm xl:text-base">
                  ({item.rarity}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      {pokemon.encounterLocations && pokemon.encounterLocations.length > 0 && (
        <div>
          <div className="mb-1">
            <MetaLabel>Where to Find</MetaLabel>
          </div>
          <div className="flex flex-col gap-1.5">
            {pokemon.encounterLocations.map(({ location, versions }) => (
              <div className="flex items-start gap-2" key={location}>
                <span className={`${PANEL_BODY_TEXT} text-white/70 capitalize flex-1`}>
                  {location.replace(/-/g, ' ')}
                </span>
                <div className="flex flex-wrap justify-end gap-1">
                  {versions.map(v => (
                    <span
                      className={`rounded-full bg-white/10 px-2 py-px text-white/40 capitalize ${PANEL_CHIP_TEXT}`}
                      key={v}
                    >
                      {v.replace(/-/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </TabPanelContent>
  )
}

function BioPanelSkeleton() {
  return (
    <TabPanelContent className="flex flex-col gap-2 sm:gap-3">
      <div className="animate-pulse flex flex-col gap-2 sm:gap-3">
        <div className="h-4 xl:h-5 w-36 xl:w-44 rounded bg-white/10" />
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div className="flex flex-col gap-1" key={i}>
              <div className="h-3 xl:h-3.5 w-12 xl:w-14 rounded bg-white/10" />
              <div className="h-4 xl:h-5 w-20 xl:w-24 rounded bg-white/10" />
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="h-3.5 xl:h-4 w-full rounded bg-white/10" />
          <div className="h-3.5 xl:h-4 w-full rounded bg-white/10" />
          <div className="h-3.5 xl:h-4 w-3/4 rounded bg-white/10" />
        </div>
      </div>
    </TabPanelContent>
  )
}

function formatGender(genderRate: number | undefined) {
  if (genderRate === undefined) return '—'
  if (genderRate === -1) return 'Genderless'
  if (genderRate === 0) return '100% ♂'
  if (genderRate === 8) return '100% ♀'
  const female = Math.round((genderRate / 8) * 100)
  return `${100 - female}% ♂ / ${female}% ♀`
}
