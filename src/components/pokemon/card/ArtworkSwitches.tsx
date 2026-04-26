import { type ReactNode } from 'react'
import { TbSparkles } from 'react-icons/tb'

import type { PokemonEntry } from '@/lib/types'

function getAvailableToggles(
  pokemon: PokemonEntry,
  gifError: boolean,
  gmaxEnabled: boolean
) {
  return {
    show3D: !gifError && !gmaxEnabled,
    showGmax: !!pokemon.gigantamax,
    showShiny: !gmaxEnabled,
  }
}

export function ArtworkSwitches({
  gifEnabled,
  gifError,
  gmaxEnabled,
  pokemon,
  setGifEnabled,
  setGmaxEnabled,
  setShinyEnabled,
  shinyEnabled
}: {
  gifEnabled: boolean
  gifError: boolean
  gmaxEnabled: boolean
  pokemon: PokemonEntry
  setGifEnabled: (v: boolean) => void
  setGmaxEnabled: (v: boolean) => void
  setShinyEnabled: (v: boolean) => void
  shinyEnabled: boolean
}) {
  const { show3D, showGmax, showShiny } = getAvailableToggles(
    pokemon,
    gifError,
    gmaxEnabled
  )

  return (
    <>
      {showGmax && (
        <ToggleChip
          active={gmaxEnabled}
          onClick={() => {
            if (!gmaxEnabled) {
              setShinyEnabled(false)
            }
            setGmaxEnabled(!gmaxEnabled)
          }}
        >
          G-Max
        </ToggleChip>
      )}
      {showShiny && (
        <ToggleChip
          active={shinyEnabled}
          onClick={() => setShinyEnabled(!shinyEnabled)}
        >
          <TbSparkles size={10} />
          Shiny
        </ToggleChip>
      )}
      {show3D && (
        <ToggleChip
          active={gifEnabled}
          onClick={() => setGifEnabled(!gifEnabled)}
        >
          3D
        </ToggleChip>
      )}
    </>
  )
}

function ToggleChip({
  active,
  children,
  onClick
}: {
  active: boolean
  children: ReactNode
  onClick: () => void
}) {
  return (
    <button
      className={`flex cursor-pointer select-none items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium transition-colors ${
        active
          ? 'bg-white/20 text-white/80'
          : 'bg-white/10 text-white/35 hover:bg-white/15 hover:text-white/55'
      }`}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  )
}
