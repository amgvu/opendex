import { getTypeColor } from '@/lib/pokemon'
import type { Pokemon } from '@/types/pokemon'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from './ui/dialog'

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}

export function PokemonModal({
  onClose,
  pokemon
}: {
  onClose: () => void
  pokemon: Pokemon | null
}) {
  if (!pokemon) return null

  return (
    <Dialog onOpenChange={open => { if (!open) onClose() }} open={!!pokemon}>
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

          <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
            <Stat label="HP" value={pokemon.hp} />
            <Stat label="Attack" value={pokemon.attack} />
            <Stat label="Defense" value={pokemon.defense} />
            <Stat label="Sp. Attack" value={pokemon.specialAttack} />
            <Stat label="Sp. Defense" value={pokemon.specialDefense} />
            <Stat label="Speed" value={pokemon.speed} />
            <Stat label="Height" value={`${pokemon.height}m`} />
            <Stat label="Weight" value={`${pokemon.weight}kg`} />
            <Stat label="Generation" value={pokemon.generation} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
