import { POKEMON_GRID_COLS } from '@/lib/constants'

import { DefaultCardSkeleton } from './card/default/DefaultCardSkeleton'

const SKELETONS = Array.from({ length: 18 })

export function GridStatus({
  empty,
  status
}: {
  empty: boolean
  status: 'error' | 'pending' | 'success'
}) {
  if (status === 'pending')
    return (
      <div className={POKEMON_GRID_COLS}>
        {SKELETONS.map((_, i) => (
          <DefaultCardSkeleton key={i} />
        ))}
      </div>
    )
  if (status === 'error')
    return <p className="text-center text-red-500">Failed to load Pokemon.</p>
  if (empty)
    return (
      <p className="text-center text-muted-foreground">No Pokemon found.</p>
    )
  return null
}
