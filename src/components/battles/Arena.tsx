'use client'

import { useQuery } from '@tanstack/react-query'
import { motion, useAnimation } from 'motion/react'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

import type { BattleTurn } from '@/types/battle'

import { useLiveBattle } from '@/hooks/battle/useLiveBattle'
import { fetchBattle } from '@/lib/api'
import { getTypeColor } from '@/lib/pokemon'
import { getPokemonById } from '@/lib/pokemon-lookup'

// ---------------------------------------------------------------------------
// FighterCard
// ---------------------------------------------------------------------------

export function Arena({ battleId, onClose }: { battleId: string; onClose: () => void }) {
  // Single fetch to get status + full turn list (for completed battles)
  const { data: battle } = useQuery({
    queryFn: () => fetchBattle(battleId),
    queryKey: ['battle', battleId],
    // Only poll while battle is not yet completed (to catch queued→active transition)
    refetchInterval: q =>
      q.state.data?.status === 'completed' ? false : 3000,
  })

  const isCompleted = battle?.status === 'completed'

  // SSE stream — only for live/queued battles
  const sse = useLiveBattle(battleId, isCompleted ?? true)

  // Pick the authoritative turns source:
  //   completed → full list from REST fetch (replay with timer)
  //   live      → turns from SSE (driven by backend timing)
  const sourceTurns = isCompleted ? (battle?.turns ?? []) : sse.turns

  const p1Static = battle ? getPokemonById(battle.pokemon1Id) : undefined
  const p2Static = battle ? getPokemonById(battle.pokemon2Id) : undefined
  const p1MaxHp = p1Static?.hp ?? 100
  const p2MaxHp = p2Static?.hp ?? 100

  const [turnIdx, setTurnIdx] = useState(-1)
  const [p1Hp, setP1Hp] = useState(p1MaxHp)
  const [p2Hp, setP2Hp] = useState(p2MaxHp)

  // Sync initial HP when static data loads
  useEffect(() => {
    if (p1Static && turnIdx === -1) setP1Hp(p1Static.hp)
    if (p2Static && turnIdx === -1) setP2Hp(p2Static.hp)
  }, [p1Static?.id, p2Static?.id])

  // ── Live mode: apply each SSE turn immediately as it arrives ──────────────
  const prevSSELen = useRef(0)
  useEffect(() => {
    if (isCompleted) return
    if (sse.turns.length <= prevSSELen.current) return

    // Drain any new turns (usually just one at a time from the backend)
    const startIdx = prevSSELen.current
    prevSSELen.current = sse.turns.length

    // Apply turns sequentially with a small visual gap between them
    sse.turns.slice(startIdx).forEach((turn, i) => {
      setTimeout(() => {
        setTurnIdx(startIdx + i)
        setP1Hp(turn.pokemon1HpRemaining)
        setP2Hp(turn.pokemon2HpRemaining)
      }, i * 200)
    })
  }, [sse.turns.length, isCompleted])

  // ── Replay mode: timer-driven for completed battles ───────────────────────
  useEffect(() => {
    if (!isCompleted) return
    if (!sourceTurns.length) return
    if (turnIdx >= sourceTurns.length - 1) return

    const delay = turnIdx === -1 ? 900 : 1800
    const timer = setTimeout(() => {
      const next = turnIdx + 1
      const turn = sourceTurns[next]
      setTurnIdx(next)
      setP1Hp(turn.pokemon1HpRemaining)
      setP2Hp(turn.pokemon2HpRemaining)
    }, delay)

    return () => clearTimeout(timer)
  }, [isCompleted, sourceTurns.length, turnIdx])

  const currentTurn = turnIdx >= 0 ? (sourceTurns[turnIdx] ?? null) : null

  const winnerName =
    isCompleted ? battle?.winnerName : sse.isDone ? sse.winnerName : null
  const replayFinished = isCompleted && turnIdx === sourceTurns.length - 1
  const done = isCompleted ? replayFinished : sse.isDone

  const totalTurns = sourceTurns.length

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/95 p-4 sm:p-6 overflow-y-auto">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between shrink-0">
        <p className="text-xs font-semibold uppercase tracking-widest text-white/40">
          {battle?.status === 'queued'
            ? 'Waiting in queue…'
            : battle?.status === 'active' && !done
            ? totalTurns > 0
              ? `Turn ${turnIdx + 1} / ${totalTurns}`
              : 'Battle starting…'
            : done
            ? '⚔ Battle complete'
            : 'Loading…'}
        </p>
        <button
          className="rounded-lg px-3 py-1 text-sm text-white/50 hover:text-white transition-colors"
          onClick={onClose}
        >
          ✕ Close
        </button>
      </div>

      {/* Fighters */}
      {battle && (
        <div className="flex flex-1 items-center gap-3 sm:gap-6">
          <FighterCard
            currentHp={p1Hp}
            currentTurn={currentTurn}
            maxHp={p1MaxHp}
            name={battle.pokemon1Name}
            pokemonId={battle.pokemon1Id}
            side={1}
            turnIdx={turnIdx}
          />

          {/* Center */}
          <div className="flex w-12 shrink-0 flex-col items-center gap-2 text-center">
            {done && winnerName ? (
              <div className="space-y-1">
                <p className="text-2xl">🏆</p>
                <p className="text-[9px] font-black uppercase tracking-widest text-yellow-300">
                  {winnerName}
                </p>
              </div>
            ) : currentTurn ? (
              <div className="space-y-1">
                <p className="text-[9px] text-white/40 uppercase tracking-wider">atk</p>
                <p className="text-[10px] font-bold capitalize text-white leading-tight">
                  {currentTurn.attackerName}
                </p>
              </div>
            ) : (
              <span className="text-base font-black text-white/20">VS</span>
            )}
          </div>

          <FighterCard
            currentHp={p2Hp}
            currentTurn={currentTurn}
            maxHp={p2MaxHp}
            name={battle.pokemon2Name}
            pokemonId={battle.pokemon2Id}
            side={2}
            turnIdx={turnIdx}
          />
        </div>
      )}

      {/* Turn log */}
      {sourceTurns.length > 0 && (
        <div className="mt-4 shrink-0 overflow-x-auto">
          <div className="flex gap-1.5 pb-1">
            {sourceTurns.slice(0, turnIdx + 1).map((t, i) => (
              <div
                className="shrink-0 rounded bg-white/10 px-2 py-1 text-[9px] text-white/50"
                key={i}
              >
                <span className="capitalize">{t.attackerName}</span>
                {' '}→{' '}
                <span className="text-red-400 font-semibold">-{t.damage}</span>
                {t.typeMultiplier > 1 && <span className="text-yellow-400 ml-0.5">↑</span>}
                {t.typeMultiplier < 1 && <span className="text-blue-400 ml-0.5">↓</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Arena
// ---------------------------------------------------------------------------

function FighterCard({
  currentHp,
  currentTurn,
  maxHp,
  name,
  pokemonId,
  side,
  turnIdx,
}: {
  currentHp: number
  currentTurn: BattleTurn | null
  maxHp: number
  name: string
  pokemonId: number
  side: 1 | 2
  turnIdx: number
}) {
  const pokemon = getPokemonById(pokemonId)
  const typeColor = getTypeColor(pokemon?.types[0] ?? '')
  const iconSrc = `/icons/${(pokemon?.types[0] ?? 'normal').toLowerCase()}.svg`

  const isAttacking = currentTurn !== null && currentTurn.attackerId === pokemonId
  const isHit = currentTurn !== null && currentTurn.defenderId === pokemonId

  const hpPct = Math.max(0, (currentHp / maxHp) * 100)
  const hpColor = hpPct > 50 ? 'bg-green-400' : hpPct > 25 ? 'bg-yellow-400' : 'bg-red-400'

  const lungeDir = side === 1 ? 1 : -1
  const lungeControls = useAnimation()
  const shakeControls = useAnimation()
  const prevTurnIdx = useRef(-1)

  useEffect(() => {
    if (turnIdx === prevTurnIdx.current) return
    prevTurnIdx.current = turnIdx

    if (isAttacking) {
      lungeControls.start({
        transition: { duration: 0.45, ease: [0.4, 0, 0.2, 1] },
        x: [0, lungeDir * 52, 0],
      })
    }
    if (isHit) {
      shakeControls.start({
        transition: { duration: 0.4 },
        x: [0, -12, 12, -9, 9, -5, 5, 0],
      })
    }
  }, [turnIdx])

  return (
    <motion.div animate={lungeControls} className="flex-1 min-w-0">
      <motion.div
        animate={shakeControls}
        className={`relative overflow-hidden rounded-2xl ${typeColor} flex flex-col items-center gap-2 p-4`}
      >
        <div className="absolute inset-0 bg-black/25" />

        <Image
          alt=""
          aria-hidden
          className="absolute opacity-10 grayscale"
          height={200}
          src={iconSrc}
          style={side === 1 ? { bottom: -20, left: -20 } : { bottom: -20, right: -20 }}
          unoptimized
          width={200}
        />

        <div className="relative z-10 h-32 w-32 sm:h-40 sm:w-40">
          {pokemon?.officialUrl && (
            <Image
              alt={name}
              className="object-contain drop-shadow-2xl"
              fill
              src={pokemon.officialUrl}
              style={{
                opacity: currentHp === 0 ? 0.2 : 1,
                transform: side === 2 ? 'scaleX(-1)' : 'none',
                transition: 'opacity 0.5s',
              }}
              unoptimized
            />
          )}
        </div>

        <p className="relative z-10 text-sm font-bold capitalize text-white drop-shadow">
          {name}
        </p>

        <div className="relative z-10 w-full space-y-1">
          <div className="flex justify-between text-[10px] font-semibold text-white/70">
            <span>HP</span>
            <span>{Math.max(0, currentHp)} / {maxHp}</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-black/30">
            <motion.div
              animate={{ width: `${hpPct}%` }}
              className={`h-full rounded-full ${hpColor}`}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>
        </div>

        {isHit && currentTurn && (
          <motion.div
            animate={{ opacity: [0, 1, 1, 0], y: [0, -20] }}
            className="absolute top-3 z-20 rounded-full bg-red-500 px-2 py-0.5 text-xs font-black text-white shadow"
            initial={{ opacity: 0, y: 0 }}
            key={`dmg-${turnIdx}`}
            transition={{ duration: 0.9 }}
          >
            -{currentTurn.damage}
            {currentTurn.typeMultiplier > 1 && <span className="ml-1 text-yellow-300">2×</span>}
            {currentTurn.typeMultiplier < 1 && <span className="ml-1 text-blue-300">½×</span>}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  )
}
