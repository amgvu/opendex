export function GridStatus({
  empty,
  status
}: {
  empty: boolean
  status: 'error' | 'pending' | 'success'
}) {
  if (status === 'pending') return <p className="text-center">Loading...</p>
  if (status === 'error')
    return <p className="text-center text-red-500">Failed to load Pokemon.</p>
  if (empty)
    return (
      <p className="text-center text-muted-foreground">No Pokemon found.</p>
    )
  return null
}
