import { type ReactNode } from 'react'
import { TbSparkles } from 'react-icons/tb'

import type { PokemonEntry, PokemonListEntry } from '@/lib/types'

export function ArtworkSwitches({
  detail,
  gifEnabled,
  gifError,
  gmaxEnabled,
  pokemon,
  setGifEnabled,
  setGmaxEnabled,
  setShinyEnabled,
  shinyEnabled
}: {
  detail?: PokemonEntry
  gifEnabled: boolean
  gifError: boolean
  gmaxEnabled: boolean
  pokemon: PokemonListEntry
  setGifEnabled: (v: boolean) => void
  setGmaxEnabled: (v: boolean) => void
  setShinyEnabled: (v: boolean) => void
  shinyEnabled: boolean
}) {
  const { show3D, showGmax, showShiny } = getAvailableToggles(
    detail,
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

function getAvailableToggles(
  detail: PokemonEntry | undefined,
  gifError: boolean,
  gmaxEnabled: boolean
) {
  return {
    show3D: !gifError && !gmaxEnabled,
    showGmax: !!detail?.gigantamax,
    showShiny: !gmaxEnabled,
  }
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
