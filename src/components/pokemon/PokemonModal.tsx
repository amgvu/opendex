import type { Pokemon } from '@/types/pokemon'

import { getTypeColor } from '@/lib/pokemon'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'

const STAT_MAX = 255

export function PokemonModal({
  onClose,
  pokemon
}: {
  onClose: () => void
  pokemon: null | Pokemon
}) {
  if (!pokemon) return null

  return (
    <Dialog
      onOpenChange={open => {
        if (!open) onClose()
      }}
      open={!!pokemon}
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="capitalize">{pokemon.name}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {pokemon.imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              alt={pokemon.name}
              className="mx-auto h-40 w-40 object-contain"
              src={pokemon.imageUrl}
            />
          )}

          <div className="flex flex-wrap gap-1">
            {pokemon.types.map((type: string) => (
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium text-white ${getTypeColor(type)}`}
                key={type}
              >
                {type}
              </span>
            ))}
            {pokemon.isLegendary && (
              <span className="rounded-full bg-yellow-400 px-2 py-0.5 text-xs font-medium text-black">
                Legendary
              </span>
            )}
          </div>

          <p className="text-sm text-muted-foreground">{pokemon.description}</p>

          <div className="flex flex-col gap-2">
            <StatBar label="HP" value={pokemon.hp} />
            <StatBar label="Attack" value={pokemon.attack} />
            <StatBar label="Defense" value={pokemon.defense} />
            <StatBar label="Sp. Attack" value={pokemon.specialAttack} />
            <StatBar label="Sp. Defense" value={pokemon.specialDefense} />
            <StatBar label="Speed" value={pokemon.speed} />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <StatRow label="Height" value={`${pokemon.height.toFixed(1)}m`} />
            <StatRow
              label="Weight"
              value={`${pokemon.weight.toFixed(1)} lbs`}
            />
            <StatRow label="Gen" value={pokemon.generation} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function StatBar({ label, value }: { label: string; value: number }) {
  const pct = Math.round((value / STAT_MAX) * 100)

  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="w-20 shrink-0 text-muted-foreground">{label}</span>
      <span className="w-8 shrink-0 text-right font-medium">{value}</span>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

function StatRow({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}
