import type { Pokemon } from '@/types/pokemon'

import { InfoStat, TabPanelContent } from '../expanded/shared'

export function FullBioPanel({ pokemon }: { pokemon: Pokemon }) {
  const extraFlavors = pokemon.flavorTexts?.slice(1) ?? []

  return (
    <TabPanelContent className="flex flex-col gap-5">
      {/* Genus + primary description */}
      <div>
        {pokemon.genus && (
          <p className="mb-1 text-sm italic text-white/50">{pokemon.genus}</p>
        )}
        <p className="text-white/80 leading-relaxed">{pokemon.description}</p>
      </div>

      {/* Flavor texts: 2-col grid */}
      {extraFlavors.length > 0 && (
        <div>
          <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-white/40">
            Pokédex Entries
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            {extraFlavors.map(({ game, text }) => (
              <div className="rounded-lg bg-white/8 px-3 py-2.5" key={game}>
                <span className="mb-1 block rounded-full text-[10px] font-medium uppercase tracking-wider text-white/35 capitalize">
                  {game.replace(/-/g, ' ')}
                </span>
                <p className="text-sm text-white/60 leading-snug">{text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info grid */}
      <div className="grid grid-cols-3 gap-x-6 gap-y-3 text-sm">
        {pokemon.habitat != null && (
          <InfoStat
            label="Habitat"
            muted
            value={
              <span className="capitalize">{pokemon.habitat.replace(/-/g, ' ')}</span>
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
          <InfoStat label="Gender" muted value={formatGender(pokemon.genderRate)} />
        )}
        {pokemon.eggGroups && pokemon.eggGroups.length > 0 && (
          <InfoStat
            label="Egg Groups"
            muted
            value={
              <span className="capitalize">
                {pokemon.eggGroups.map(g => g.replace(/(\D)(\d)/, '$1 $2')).join(', ')}
              </span>
            }
          />
        )}
        {pokemon.eggCycles !== undefined && (
          <InfoStat label="Egg Cycles" muted value={`${pokemon.eggCycles} cycles`} />
        )}
      </div>

      {/* Held items */}
      {pokemon.heldItems && pokemon.heldItems.length > 0 && (
        <div>
          <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-white/40">
            Wild Held Items
          </p>
          <div className="flex flex-wrap gap-2">
            {pokemon.heldItems.map(item => (
              <div
                className="flex items-center gap-1.5 rounded-lg bg-white/8 px-3 py-1.5"
                key={item.name}
              >
                <span className="text-sm text-white/70">{item.name}</span>
                <span className="text-xs text-white/35">({item.rarity}%)</span>
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
