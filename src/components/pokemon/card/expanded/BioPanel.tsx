import type { Pokemon } from '@/types/pokemon'

import {
  InfoStat,
  MetaLabel,
  PANEL_BODY_TEXT,
  TabPanelContent
} from './shared'

export function BioPanel({ pokemon }: { pokemon: Pokemon }) {
  return (
    <TabPanelContent className="flex flex-col gap-2 sm:gap-3">
      {pokemon.genus && (
        <p className={`${PANEL_BODY_TEXT} italic text-white/50`}>
          {pokemon.genus}
        </p>
      )}
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
      <div className={`grid grid-cols-2 gap-x-4 gap-y-2 ${PANEL_BODY_TEXT}`}>
        {pokemon.habitat != null && (
          <InfoStat
            label="Habitat"
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
      </div>
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
                <span className="text-xs text-white/35 sm:text-sm xl:text-base">
                  ({item.rarity}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
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
