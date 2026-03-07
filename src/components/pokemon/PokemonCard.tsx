import Image from 'next/image'

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
      className={`relative cursor-pointer overflow-hidden rounded-xl p-4 shadow-sm transition-shadow hover:shadow-md ${getTypeColor(pokemon.types[0] ?? '')}`}
      onClick={onClick}
    >
      <div className="absolute inset-0 bg-white/20" />
      <Image
        alt=""
        aria-hidden="true"
        className="absolute -bottom-4 -right-4 opacity-20 grayscale"
        height={96}
        src="/pokemon-icon.svg"
        width={96}
      />
      <div className="relative flex items-start justify-between">
        <p className="font-semibold capitalize text-white">{pokemon.name}</p>
        <span className="text-xs font-medium text-white/70">#{pokemon.id}</span>
      </div>
      <div className="relative mt-2 flex flex-wrap gap-1">
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
