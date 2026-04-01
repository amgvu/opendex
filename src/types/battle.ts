export type BattleTurn = {
  turnNumber: number
  attackerId: number
  attackerName: string
  defenderId: number
  defenderName: string
  damage: number
  typeMultiplier: number
  pokemon1HpRemaining: number
  pokemon2HpRemaining: number
}

export type Battle = {
  battleId: string
  pokemon1Id: number
  pokemon2Id: number
  pokemon1Name: string
  pokemon2Name: string
  status: 'queued' | 'active' | 'completed'
  turns: BattleTurn[]
  winnerId: number | null
  winnerName: string | null
  createdAt: string
  completedAt: string | null
}

export type BattleSummary = {
  battleId: string
  pokemon1Id: number
  pokemon2Id: number
  pokemon1Name: string
  pokemon2Name: string
  winnerName: string | null
  winnerId: number | null
  status: 'queued' | 'active' | 'completed'
  createdAt: string
}

export type BattleHistoryResponse = {
  items: BattleSummary[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

export type StartBattleResponse = {
  battleId: string
  status: 'queued' | 'active'
  positionInQueue: number | null
}
