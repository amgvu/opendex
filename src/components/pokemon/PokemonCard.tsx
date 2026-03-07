import type { Pokemon } from '@/types/pokemon'

import { getTypeColor } from '@/lib/pokemon'

export function PokemonCard({
  onClick,
  pokemon
}: {
  onClick: () => void
  pokemon: Pokemon
}) {
  return (
    <div
      className="cursor-pointer rounded-xl border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <p className="font-semibold capitalize">{pokemon.name}</p>
        <span className="text-xs text-muted-foreground">#{pokemon.id}</span>
      </div>
      <div className="mt-2 flex flex-wrap gap-1">
        {pokemon.types.map((type: string) => (
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium text-white ${getTypeColor(type)}`}
            key={type}
          >
            {type}
          </span>
        ))}
      </div>
    </div>
  )
}
