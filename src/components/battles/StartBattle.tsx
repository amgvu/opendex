'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useCollection } from '@/hooks/query/useCollection'
import { collectionItemToPokemon } from '@/lib/pokemon-lookup'
import { startBattle } from '@/lib/api'
import { getTypeColor } from '@/lib/pokemon'

export function StartBattle() {
  const { collection, status } = useCollection()
  const queryClient = useQueryClient()
  const [p1Id, setP1Id] = useState<number | null>(null)
  const [p2Id, setP2Id] = useState<number | null>(null)

  const mutation = useMutation({
    mutationFn: () => startBattle(p1Id!, p2Id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['battles'] })
      setP1Id(null)
      setP2Id(null)
    },
  })

  if (status === 'pending') return null
  if (collection.length < 2) {
    return (
      <p className="text-sm text-white/40">
        Add at least 2 Pokemon to your collection to start a battle.
      </p>
    )
  }

  const p1 = collection.find(c => c.pokemonId === p1Id)
  const p2 = collection.find(c => c.pokemonId === p2Id)

  function handleSelect(id: number) {
    if (p1Id === null) { setP1Id(id); return }
    if (p1Id === id) { setP1Id(null); return }
    if (p2Id === id) { setP2Id(null); return }
    setP2Id(id)
  }

  return (
    <div className="space-y-4">
      {/* Selection preview */}
      <div className="flex items-center gap-3">
        <Slot item={p1 ? collectionItemToPokemon(p1) : null} label="Fighter 1" />
        <span className="text-lg font-black text-white/30">VS</span>
        <Slot item={p2 ? collectionItemToPokemon(p2) : null} label="Fighter 2" />

        <button
          className="ml-auto rounded-xl bg-red-500 px-5 py-2 text-sm font-bold text-white shadow transition hover:bg-red-400 disabled:opacity-30 disabled:cursor-not-allowed"
          disabled={!p1Id || !p2Id || mutation.isPending}
          onClick={() => mutation.mutate()}
        >
          {mutation.isPending ? 'Starting…' : 'Fight!'}
        </button>
      </div>

      {mutation.isError && (
        <p className="text-xs text-red-400">{(mutation.error as Error).message}</p>
      )}
      {mutation.isSuccess && (
        <p className="text-xs text-green-400">
          Battle {mutation.data.status === 'queued' ? 'queued' : 'started'}!
        </p>
      )}

      {/* Pokemon picker */}
      <div className="flex flex-wrap gap-2">
        {collection.map(item => {
          const poke = collectionItemToPokemon(item)
          const selected = item.pokemonId === p1Id || item.pokemonId === p2Id
          const typeColor = getTypeColor(poke.types[0] ?? '')
          return (
            <button
              key={item.pokemonId}
              onClick={() => handleSelect(item.pokemonId)}
              className={`flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm font-semibold text-white transition
                ${selected ? 'ring-2 ring-white' : 'opacity-70 hover:opacity-100'} ${typeColor}`}
            >
              {poke.officialUrl && (
                <Image
                  alt={poke.name}
                  className="object-contain"
                  height={28}
                  src={poke.officialUrl}
                  unoptimized
                  width={28}
                />
              )}
              <span className="capitalize">{poke.name}</span>
              <span className="text-white/60 text-xs">Lv.{item.level}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function Slot({ item, label }: { item: { officialUrl?: string; name: string } | null; label: string }) {
  if (!item) {
    return (
      <div className="flex h-14 w-28 items-center justify-center rounded-xl border border-white/10 text-xs text-white/30">
        {label}
      </div>
    )
  }
  return (
    <div className="flex h-14 w-28 items-center justify-center gap-1 rounded-xl bg-white/10 text-xs font-semibold text-white capitalize">
      {item.officialUrl && (
        <Image alt={item.name} className="object-contain" height={36} src={item.officialUrl} unoptimized width={36} />
      )}
      {item.name}
    </div>
  )
}
