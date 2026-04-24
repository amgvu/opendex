import { type ReactNode } from 'react'
import { TbSparkles } from 'react-icons/tb'

import type { Pokemon } from '@/lib/types'

export function ArtworkSwitches({
  femaleEnabled,
  gifEnabled,
  gifError,
  gmaxEnabled,
  hasGigantamax,
  hasFemale,
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
  hasGigantamax: boolean
  hasFemale: boolean
  pokemon: Pick<Pokemon, 'shiny'>
  setFemaleEnabled: (v: boolean) => void
  setGifEnabled: (v: boolean) => void
  setGmaxEnabled: (v: boolean) => void
  setShinyEnabled: (v: boolean) => void
  shinyEnabled: boolean
}) {
  return (
    <>
      {hasGigantamax && (
        <ToggleChip
          active={gmaxEnabled}
          onClick={() => setGmaxEnabled(!gmaxEnabled)}
        >
          G-Max
        </ToggleChip>
      )}
      {hasFemale && (
        <ToggleChip
          active={femaleEnabled}
          onClick={() => setFemaleEnabled(!femaleEnabled)}
        >
          ♀
        </ToggleChip>
      )}
      {pokemon.shiny && (
        <ToggleChip
          active={shinyEnabled}
          onClick={() => setShinyEnabled(!shinyEnabled)}
        >
          <TbSparkles size={10} />
          Shiny
        </ToggleChip>
      )}
      {!gifError && !gmaxEnabled && (
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
