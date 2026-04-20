import { Label, Switch } from '@heroui/react'
import { type CSSProperties } from 'react'

import type { Pokemon } from '@/types/pokemon'

import { bgClassToVar } from '@/lib/pokemon'

export function ArtworkSwitches({
  gifEnabled,
  gifError,
  labelClassName,
  pokemon,
  setGifEnabled,
  setShinyEnabled,
  shinyEnabled,
  typeColor
}: {
  gifEnabled: boolean
  gifError: boolean
  labelClassName: string
  pokemon: Pick<Pokemon, 'shiny'>
  setGifEnabled: (v: boolean) => void
  setShinyEnabled: (v: boolean) => void
  shinyEnabled: boolean
  typeColor: string
}) {
  const switchStyle = {
    '--switch-control-bg': `color-mix(in oklab, ${bgClassToVar(typeColor)}, white 40%)`,
    '--switch-control-bg-checked': bgClassToVar(typeColor),
    '--switch-control-bg-checked-hover': bgClassToVar(typeColor),
    '--switch-control-bg-hover': `color-mix(in oklab, ${bgClassToVar(typeColor)}, white 30%)`
  } as CSSProperties

  return (
    <>
      {pokemon.shiny && (
        <Switch
          isSelected={shinyEnabled}
          onChange={v => setShinyEnabled(v)}
          size="sm"
          style={switchStyle}
        >
          <Switch.Control>
            <Switch.Thumb />
          </Switch.Control>
          <Switch.Content>
            <Label className={labelClassName}>Shiny</Label>
          </Switch.Content>
        </Switch>
      )}
      {!gifError && (
        <Switch
          isSelected={gifEnabled}
          onChange={v => setGifEnabled(v)}
          size="sm"
          style={switchStyle}
        >
          <Switch.Control>
            <Switch.Thumb />
          </Switch.Control>
          <Switch.Content>
            <Label className={labelClassName}>3D</Label>
          </Switch.Content>
        </Switch>
      )}
    </>
  )
}
