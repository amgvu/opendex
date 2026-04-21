import { type ReactNode } from 'react'
import { TbSparkles } from 'react-icons/tb'

import type { Pokemon } from '@/types/pokemon'

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

export function ArtworkSwitches({
  gifEnabled,
  gifError,
  pokemon,
  setGifEnabled,
  setShinyEnabled,
  shinyEnabled
}: {
  gifEnabled: boolean
  gifError: boolean
  pokemon: Pick<Pokemon, 'shiny'>
  setGifEnabled: (v: boolean) => void
  setShinyEnabled: (v: boolean) => void
  shinyEnabled: boolean
}) {
  return (
    <>
      {pokemon.shiny && (
        <ToggleChip
          active={shinyEnabled}
          onClick={() => setShinyEnabled(!shinyEnabled)}
        >
          <TbSparkles size={10} />
          Shiny
        </ToggleChip>
      )}
      {!gifError && (
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
