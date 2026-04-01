'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

import { useCollection } from '@/hooks/query/useCollection'
import { fetchBattleHistory, startBattle } from '@/lib/api'
import { collectionItemToPokemon } from '@/lib/pokemon-lookup'

import { PickerCard } from './PickerCard'

const MAX_ACTIVE = 3

export function StartBattle() {
  const { collection, status } = useCollection()
  const queryClient = useQueryClient()
  const [p1Id, setP1Id] = useState<null | number>(null)
  const [p2Id, setP2Id] = useState<null | number>(null)

  const { data: historyData } = useQuery({
    queryFn: () => fetchBattleHistory(1),
    queryKey: ['battles', 1],
    refetchInterval: 5_000,
    staleTime: 5_000
  })
  const activeCount =
    historyData?.items.filter(b => b.status === 'active').length ?? 0
  const queuedCount =
    historyData?.items.filter(b => b.status === 'queued').length ?? 0
  const slotsUsed = activeCount

  const mutation = useMutation({
    mutationFn: () => startBattle(p1Id!, p2Id!),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['battles'] })
      setP1Id(null)
      setP2Id(null)
    }
  })

  if (status === 'pending') return null

  if (collection.length < 2) {
    return (
      <p className="text-sm text-white/40">
        Add at least 2 Pokemon to your collection to start a battle.
      </p>
    )
  }

  function handleSelect(id: number) {
    if (p1Id === id) {
      setP1Id(null)
      return
    }
    if (p2Id === id) {
      setP2Id(null)
      return
    }
    if (p1Id === null) {
      setP1Id(id)
      return
    }
    if (p2Id === null) {
      setP2Id(id)
      return
    }
    // both slots full — replace p2
    setP2Id(id)
  }

  const canFight = p1Id !== null && p2Id !== null && !mutation.isPending
  const willQueue = slotsUsed >= MAX_ACTIVE

  return (
    <div className="space-y-4">
      {/* Slot pips + fight button */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {/* Active slot pips */}
          <div className="flex gap-1">
            {Array.from({ length: MAX_ACTIVE }).map((_, i) => (
              <span
                className={`block h-2 w-2 rounded-full transition-colors ${
                  i < activeCount ? 'bg-green-400' : 'bg-white/20'
                }`}
                key={i}
              />
            ))}
          </div>
          <p className="text-[10px] text-white/40">
            {activeCount}/{MAX_ACTIVE} active
            {queuedCount > 0 && ` · ${queuedCount} queued`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <p className="text-xs text-white/40">
            {p1Id && p2Id
              ? willQueue
                ? 'Will be queued'
                : 'Ready!'
              : p1Id
                ? 'Pick a second fighter'
                : 'Pick two fighters'}
          </p>
          <button
            className={`rounded-xl px-5 py-2 text-sm font-bold text-white shadow transition disabled:opacity-30 disabled:cursor-not-allowed
              ${willQueue ? 'bg-amber-500 hover:bg-amber-400' : 'bg-red-500 hover:bg-red-400'}`}
            disabled={!canFight}
            onClick={() => mutation.mutate()}
          >
            {mutation.isPending ? 'Starting…' : willQueue ? 'Queue' : 'Fight!'}
          </button>
        </div>
      </div>

      {mutation.isError && (
        <p className="text-xs text-red-400">{mutation.error.message}</p>
      )}
      {mutation.isSuccess && (
        <p className="text-xs text-green-400">
          {mutation.data.status === 'queued'
            ? `Queued at position ${mutation.data.positionInQueue ?? '?'} — will start when a slot opens`
            : 'Battle started!'}
        </p>
      )}

      {/* Picker grid */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
        {collection.map(item => {
          const pokemon = collectionItemToPokemon(item)
          const selected = item.pokemonId === p1Id || item.pokemonId === p2Id
          return (
            <PickerCard
              collectionItem={item}
              key={item.pokemonId}
              onSelect={() => handleSelect(item.pokemonId)}
              pokemon={pokemon}
              selected={selected}
            />
          )
        })}
      </div>
    </div>
  )
}
