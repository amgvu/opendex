'use client'

import { useState } from 'react'

import { PokemonCard } from '@/components/pokemon/card/PokemonCard'
import { useCollection } from '@/hooks/query/useCollection'
import { collectionItemToPokemon } from '@/lib/pokemon-lookup'

export function CollectionGrid() {
  const { collection, status } = useCollection()
  const [selectedId, setSelectedId] = useState<number | null>(null)

  if (status === 'pending') {
    return (
      <div className="flex h-64 items-center justify-center text-white/50">
        Loading collection...
      </div>
    )
  }

  if (collection.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-2 text-white/50">
        <p className="text-lg font-medium">No Pokemon yet</p>
        <p className="text-sm">Browse the Pokedex and add some to your collection</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {collection.map((item, index) => {
        const pokemon = collectionItemToPokemon(item)
        const isActive = selectedId === item.pokemonId

        return (
          <PokemonCard
            key={item.pokemonId}
            active={isActive}
            collectionItem={item}
            index={index}
            onClick={() => setSelectedId(item.pokemonId)}
            onClose={() => setSelectedId(null)}
            onNext={() => {
              const nextIndex = (index + 1) % collection.length
              setSelectedId(collection[nextIndex]!.pokemonId)
            }}
            onPrev={() => {
              const prevIndex = (index - 1 + collection.length) % collection.length
              setSelectedId(collection[prevIndex]!.pokemonId)
            }}
            pokemon={pokemon}
          />
        )
      })}
    </div>
  )
}
