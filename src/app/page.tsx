import type { Metadata } from 'next'
import { Suspense } from 'react'

import type { PokemonEntry } from '@/types/pokemon'

import PokemonGrid from '@/components/pokemon/PokemonGrid'
import pokemonData from '@/data/pokemon.json'

const pokemonByName = new Map(
  (pokemonData as unknown as PokemonEntry[]).map(p => [p.name, p])
)

type SearchParams = Promise<{ pokemon?: string | string[] }>

export async function generateMetadata({
  searchParams
}: {
  searchParams: SearchParams
}): Promise<Metadata> {
  const { pokemon: param } = await searchParams
  const name = Array.isArray(param) ? param[0] : param

  const defaultMeta: Metadata = {
    description:
      'Community-made Pokédex. Browse all 1,025 Pokémon - stats, types, abilities, and more.',
    title: 'Opendex'
  }

  if (!name) return defaultMeta

  const pokemon = pokemonByName.get(name)
  if (!pokemon) return defaultMeta

  const displayName = name.charAt(0).toUpperCase() + name.slice(1)

  return {
    description: pokemon.description,
    openGraph: {
      images: [{ height: 630, url: `/api/og?pokemon=${name}`, width: 1200 }]
    },
    title: `${displayName} | Opendex`,
    twitter: {
      card: 'summary_large_image',
      images: [`/api/og?pokemon=${name}`]
    }
  }
}

export default function Home() {
  return (
    <main>
      <Suspense>
        <PokemonGrid />
      </Suspense>
    </main>
  )
}
