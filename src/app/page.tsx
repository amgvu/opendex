import type { Metadata } from 'next'

import { Suspense } from 'react'

import PokemonGrid from '@/components/pokemon/PokemonGrid'
import { buildFilterMetadata } from '@/lib/metadata'
import { pokemonByName } from '@/lib/pokemon-data'
import { capitalize, SITE_NAME } from '@/lib/pokemon'

export async function generateMetadata({
  searchParams
}: {
  searchParams: Promise<{
    gens?: string
    pokemon?: string
    sortBy?: string
    sortOrder?: string
    types?: string
  }>
}): Promise<Metadata> {
  const { gens: gensParam, pokemon: name, sortBy, sortOrder, types: typesParam } =
    await searchParams

  if (name) {
    const pokemon = pokemonByName.get(name)
    if (pokemon) {
      const displayName = capitalize(pokemon.name)
      const types = pokemon.types.join(' · ')
      const description = `${displayName} (#${pokemon.id}) · ${types}. ${pokemon.description}`
      const title = `${displayName} — ${SITE_NAME}`
      return {
        description,
        openGraph: {
          description,
          images: pokemon.officialUrl ? [{ url: pokemon.officialUrl }] : undefined,
          title
        },
        title,
        twitter: {
          card: 'summary',
          description,
          images: pokemon.officialUrl ? [pokemon.officialUrl] : undefined,
          title
        }
      }
    }
  }

  const types = typesParam?.split(',').filter(Boolean) ?? []
  const gens = gensParam?.split(',').map(Number).filter(Boolean) ?? []
  const filterMeta = buildFilterMetadata(types, gens, sortBy ?? 'id', sortOrder ?? 'asc')

  if (!filterMeta) return { title: SITE_NAME }

  const { description, title } = filterMeta
  return {
    description,
    openGraph: { description, title },
    title,
    twitter: { card: 'summary', description, title }
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
