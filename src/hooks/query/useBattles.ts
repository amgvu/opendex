import { useQuery } from '@tanstack/react-query'
import { fetchBattleHistory } from '@/lib/api'

export function useBattleHistory(page = 1) {
  return useQuery({
    queryKey: ['battles', page],
    queryFn: () => fetchBattleHistory(page),
    staleTime: 10_000,
  })
}
