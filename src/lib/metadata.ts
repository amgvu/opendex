import type { Metadata } from 'next'

import type { Pokemon } from '@/types/pokemon'

const BASE_URL = 'https://opendex.live'
const OG_IMAGE_WIDTH = 1200
const OG_IMAGE_HEIGHT = 630
const DESCRIPTION_MAX_LENGTH = 160
const FULL_DESCRIPTION_MAX_LENGTH = 200

export function generatePokemonMetadata(pokemon: Pokemon): Metadata {
  const typesList = pokemon.types.join(', ')
  const genus = pokemon.genus || 'Pokémon'
  const title = `${pokemon.name} - ${typesList} ${genus} | Opendex`
  const statsLine = `HP: ${pokemon.hp}, ATK: ${pokemon.attack}, DEF: ${pokemon.defense}, SpA: ${pokemon.specialAttack}, SpD: ${pokemon.specialDefense}, SPD: ${pokemon.speed}`
  let descriptionText = pokemon.description
  if (
    !descriptionText &&
    pokemon.flavorTexts &&
    pokemon.flavorTexts.length > 0
  ) {
    descriptionText = pokemon.flavorTexts[0].text
  }
  const baseDesc = descriptionText
    ? descriptionText.substring(0, DESCRIPTION_MAX_LENGTH)
    : `${pokemon.name} is a ${typesList} type Pokémon`
  const description =
    baseDesc.length + statsLine.length > FULL_DESCRIPTION_MAX_LENGTH
      ? `${baseDesc} | ${statsLine}`.substring(0, FULL_DESCRIPTION_MAX_LENGTH)
      : `${baseDesc} | ${statsLine}`
  const imageUrl = pokemon.officialUrl || pokemon.imageUrl

  return {
    description,
    openGraph: {
      description: description,
      images: [
        {
          alt: `${pokemon.name} artwork`,
          height: OG_IMAGE_HEIGHT,
          url: imageUrl,
          width: OG_IMAGE_WIDTH
        }
      ],
      siteName: 'Opendex',
      title: title,
      type: 'website',
      url: `${BASE_URL}/?pokemon=${pokemon.name.toLowerCase()}`
    },
    title: title,
    twitter: {
      card: 'summary_large_image',
      description: description,
      images: imageUrl,
      title: title
    }
  }
}

export const DEFAULT_METADATA: Metadata = {
  description:
    'Community-made Pokédex. Browse all 1,025 Pokémon - stats, types, abilities, and more.',
  openGraph: {
    description:
      'Community-made Pokédex. Browse all 1,025 Pokémon - stats, types, abilities, and more.',
    images: [
      {
        alt: 'Opendex - Pokémon Explorer',
        height: OG_IMAGE_HEIGHT,
        url: `${BASE_URL}/og-image.png`,
        width: OG_IMAGE_WIDTH
      }
    ],
    siteName: 'Opendex',
    title: 'Opendex - Community Pokédex',
    type: 'website',
    url: BASE_URL
  },
  title: 'Opendex'
}
