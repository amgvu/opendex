import type { Metadata } from 'next'

import { Suspense } from 'react'

import PokemonGrid from '@/components/pokemon/PokemonGrid'
import { capitalize, pokemonByName, SITE_NAME } from '@/lib/pokemon'

export async function generateMetadata({
  searchParams
}: {
  searchParams: Promise<{ pokemon?: string }>
}): Promise<Metadata> {
  const { pokemon: name } = await searchParams
  if (!name) return { title: SITE_NAME }

  const pokemon = pokemonByName.get(name)
  if (!pokemon) return { title: SITE_NAME }

  const displayName = capitalize(pokemon.name)
  const types = pokemon.types.join(' · ')
  const description = `${displayName} (#${pokemon.id}) · ${types}. ${pokemon.description}`
  const title = `${displayName} — ${SITE_NAME}`

  return {
    description,
    title,
    openGraph: {
      description,
      images: pokemon.officialUrl ? [{ url: pokemon.officialUrl }] : undefined,
      title
    },
    twitter: {
      card: 'summary',
      description,
      images: pokemon.officialUrl ? [pokemon.officialUrl] : undefined,
      title
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
