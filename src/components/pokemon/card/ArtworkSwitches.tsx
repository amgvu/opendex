import { type ReactNode } from 'react'
import { TbSparkles } from 'react-icons/tb'

import type { PokemonEntry } from '@/lib/types'

type ToggleState = {
  femaleEnabled: boolean
  gmaxEnabled: boolean
  shinyEnabled: boolean
}

function getAvailableToggles(
  pokemon: PokemonEntry,
  gifError: boolean,
  { femaleEnabled, gmaxEnabled, shinyEnabled }: ToggleState
) {
  return {
    show3D: !gifError && !gmaxEnabled && !femaleEnabled,
    showFemale: !!pokemon.female && !gmaxEnabled && !shinyEnabled,
    showGmax: !!pokemon.gigantamax,
    showShiny: !gmaxEnabled && !femaleEnabled,
  }
}

export function ArtworkSwitches({
  femaleEnabled,
  gifEnabled,
  gifError,
  gmaxEnabled,
  pokemon,
  setFemaleEnabled,
  setGifEnabled,
  setGmaxEnabled,
  setShinyEnabled,
  shinyEnabled
}: {
  femaleEnabled: boolean
  gifEnabled: boolean
  gifError: boolean
  gmaxEnabled: boolean
  pokemon: PokemonEntry
  setFemaleEnabled: (v: boolean) => void
  setGifEnabled: (v: boolean) => void
  setGmaxEnabled: (v: boolean) => void
  setShinyEnabled: (v: boolean) => void
  shinyEnabled: boolean
}) {
  const { show3D, showFemale, showGmax, showShiny } = getAvailableToggles(
    pokemon,
    gifError,
    { femaleEnabled, gmaxEnabled, shinyEnabled }
  )

  return (
    <>
      {showGmax && (
        <ToggleChip
          active={gmaxEnabled}
          onClick={() => {
            if (!gmaxEnabled) {
              setShinyEnabled(false)
              setFemaleEnabled(false)
            }
            setGmaxEnabled(!gmaxEnabled)
          }}
        >
          G-Max
        </ToggleChip>
      )}
      {showFemale && (
        <ToggleChip
          active={femaleEnabled}
          onClick={() => setFemaleEnabled(!femaleEnabled)}
        >
          ♀
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
