'use client'

import Image from 'next/image'

import type { CollectionItem } from '@/types/collection'
import type { Pokemon } from '@/types/pokemon'

import { TypeBadge } from '@/components/pokemon/card/TypeBadge'
import { getTypeColor } from '@/lib/pokemon'

export function PickerCard({
  collectionItem,
  onSelect,
  pokemon,
  selected
}: {
  collectionItem: CollectionItem
  onSelect: () => void
  pokemon: Pokemon
  selected: boolean
}) {
  const typeColor = getTypeColor(pokemon.types[0] ?? '')
  const iconSrc = `/icons/${(pokemon.types[0] ?? 'normal').toLowerCase()}.svg`

  return (
    <button
      className={`relative h-20 w-full overflow-hidden rounded-xl p-3 cursor-pointer text-left transition-all
        [clip-path:inset(0_round_0.75rem)]
        ${typeColor}
        ${selected ? 'ring-2 ring-white brightness-110' : 'opacity-80 hover:opacity-100'}`}
      onClick={onSelect}
    >
      {/* bg tint */}
      <div className="absolute inset-0 bg-white/15" />

      {/* type icon backdrop */}
      <Image
        alt=""
        aria-hidden
        className="absolute -bottom-4 -right-4 grayscale opacity-30"
        height={96}
        src={iconSrc}
        unoptimized
        width={96}
      />

      {/* artwork */}
      <div className="absolute -bottom-4 left-16 h-28 w-28">
        <Image
          alt={pokemon.name}
          className="h-28 w-28 object-contain drop-shadow-md"
          height={112}
          src={pokemon.officialUrl}
          unoptimized
          width={112}
        />
      </div>

      {/* text */}
      <div className="relative flex h-full flex-col justify-between">
        <p className="min-w-0 truncate text-sm font-semibold capitalize text-white">
          {pokemon.name}
        </p>
        <div className="flex items-center justify-between gap-1">
          <div className="flex flex-wrap gap-1">
            {pokemon.types.map(t => (
              <TypeBadge key={t} type={t} />
            ))}
          </div>
          <span className="rounded-full bg-black/40 px-1.5 py-0.5 text-[10px] font-bold text-white">
            Lv.{collectionItem.level}
          </span>
        </div>
      </div>

      {/* selection check */}
      {selected && (
        <div className="absolute top-1.5 right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] font-black text-black">
          ✓
        </div>
      )}
    </button>
  )
}
