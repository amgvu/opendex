'use client'

import { useEffect, useRef, useState } from 'react'

import type { BattleTurn } from '@/types/battle'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'

/**
 * Connects to the SSE stream for a live/queued battle.
 * Turns are pushed by the backend as they happen (1–2s apart).
 * Skipped when `skip` is true (e.g. battle is already completed).
 */
export function useLiveBattle(battleId: string, skip: boolean) {
  const [turns, setTurns] = useState<BattleTurn[]>([])
  const [isDone, setIsDone] = useState(false)
  const [winnerId, setWinnerId] = useState<null | number>(null)
  const [winnerName, setWinnerName] = useState<null | string>(null)
  const esRef = useRef<EventSource | null>(null)

  useEffect(() => {
    if (skip) return

    const es = new EventSource(
      `${API_URL}/battles/${battleId}/stream?lastTurn=0`
    )
    esRef.current = es

    es.onmessage = (e) => {
      try {
        const turn = JSON.parse(e.data) as BattleTurn
        setTurns(prev => [...prev, turn])
      } catch {
        // ignore malformed events
      }
    }

    es.addEventListener('done', (e) => {
      try {
        const payload = JSON.parse((e).data)
        setWinnerId(payload.winnerId)
        setWinnerName(payload.winnerName)
        setIsDone(true)
      } catch {}
      es.close()
    })

    es.addEventListener('error', () => {
      es.close()
    })

    return () => {
      es.close()
      esRef.current = null
    }
  }, [battleId, skip])

  return { isDone, turns, winnerId, winnerName }
}
