import type { NextRequest } from 'next/server'

import { ImageResponse } from 'next/og'

import type { PokemonEntry } from '@/types/pokemon'

import pokemonData from '@/data/pokemon.json'
import { bgClassToVar, formatPokedexId, getTypeColor } from '@/lib/pokemon'

export const runtime = 'edge'

const pokemonByName = new Map(
  (pokemonData as unknown as PokemonEntry[]).map(p => [p.name, p])
)

export function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const name = searchParams.get('pokemon') ?? ''
  const pokemon = pokemonByName.get(name)

  if (!pokemon) {
    return new ImageResponse(
      (
        <div
          style={{
            alignItems: 'center',
            background: '#1a1a2e',
            display: 'flex',
            height: '100%',
            justifyContent: 'center',
            width: '100%'
          }}
        >
          <span style={{ color: '#ffffff', fontSize: 48, fontWeight: 700 }}>
            Opendex
          </span>
        </div>
      ),
      { height: 630, width: 1200 }
    )
  }

  const primaryType = pokemon.types[0] ?? 'Normal'
  const secondaryType = pokemon.types[1]
  const primaryHex = bgClassToVar(getTypeColor(primaryType))
  const secondaryHex = secondaryType
    ? bgClassToVar(getTypeColor(secondaryType))
    : primaryHex

  const displayName = name.charAt(0).toUpperCase() + name.slice(1)
  const formattedId = formatPokedexId(pokemon.id)

  return new ImageResponse(
    (
      <div
        style={{
          background: `linear-gradient(135deg, ${primaryHex} 0%, ${secondaryHex} 100%)`,
          display: 'flex',
          height: '100%',
          padding: '60px 80px',
          position: 'relative',
          width: '100%'
        }}
      >
        <div
          style={{
            background: 'rgba(255,255,255,0.12)',
            borderRadius: '50%',
            bottom: '-80px',
            height: '500px',
            position: 'absolute',
            right: '60px',
            width: '500px'
          }}
        />

        <div
          style={{
            display: 'flex',
            flex: 1,
            flexDirection: 'column',
            gap: '24px',
            justifyContent: 'center',
            zIndex: 1
          }}
        >
          <span
            style={{
              color: 'rgba(255,255,255,0.7)',
              fontSize: 24,
              fontWeight: 600,
              letterSpacing: '0.15em',
              textTransform: 'uppercase'
            }}
          >
            Opendex
          </span>

          <div style={{ alignItems: 'flex-end', display: 'flex', gap: '20px' }}>
            <span
              style={{
                color: '#ffffff',
                fontSize: 80,
                fontWeight: 700,
                lineHeight: 1,
                textShadow: '0 2px 8px rgba(0,0,0,0.3)'
              }}
            >
              {displayName}
            </span>
            <span
              style={{
                color: 'rgba(255,255,255,0.8)',
                fontSize: 36,
                fontWeight: 600,
                letterSpacing: '0.05em',
                paddingBottom: '8px'
              }}
            >
              {formattedId}
            </span>
          </div>

          {pokemon.genus && (
            <span
              style={{
                color: 'rgba(255,255,255,0.85)',
                fontSize: 28,
                fontWeight: 400
              }}
            >
              {pokemon.genus}
            </span>
          )}

          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            {pokemon.types.map((type: string) => {
              const hex = bgClassToVar(getTypeColor(type))
              return (
                <div
                  key={type}
                  style={{
                    background: `${hex}cc`,
                    border: '2px solid rgba(255,255,255,0.4)',
                    borderRadius: '999px',
                    color: '#ffffff',
                    fontSize: 22,
                    fontWeight: 600,
                    padding: '6px 20px'
                  }}
                >
                  {type}
                </div>
              )
            })}
          </div>

          <span
            style={{
              color: 'rgba(255,255,255,0.75)',
              fontSize: 22,
              fontWeight: 400,
              lineHeight: 1.5,
              maxWidth: '560px'
            }}
          >
            {pokemon.description}
          </span>
        </div>

        <div
          style={{
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'center',
            width: '420px'
          }}
        >
          <img
            alt={displayName}
            height={380}
            src={pokemon.officialUrl}
            style={{
              filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.35))',
              objectFit: 'contain'
            }}
            width={380}
          />
        </div>
      </div>
    ),
    { height: 630, width: 1200 }
  )
}
