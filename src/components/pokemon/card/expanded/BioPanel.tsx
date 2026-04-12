import type { Pokemon } from '@/types/pokemon'

import { InfoStat, TabPanelContent } from './shared'

export function BioPanel({ pokemon }: { pokemon: Pokemon }) {
  return (
    <TabPanelContent className="flex flex-col gap-2 sm:gap-3">
      {pokemon.genus && (
        <p className="text-xs xl:text-sm 2xl:text-base italic text-white/50">
          {pokemon.genus}
        </p>
      )}
      <p className="text-white/70 leading-snug">{pokemon.description}</p>
      {pokemon.flavorTexts && pokemon.flavorTexts.length > 1 && (
        <div className="flex flex-col gap-2">
          {pokemon.flavorTexts.slice(1).map(({ game, text }) => (
            <div key={game}>
              <span className="text-[10px] xl:text-xs 2xl:text-sm tracking-wider text-white/30 capitalize">
                {game.replace(/-/g, ' ')}
              </span>
              <p className="text-xs xl:text-sm 2xl:text-base text-white/50 leading-snug">
                {text}
              </p>
            </div>
          ))}
        </div>
      )}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs xl:text-sm 2xl:text-base">
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
