export function GridStatus({
  empty,
  status
}: {
  empty: boolean
  status: 'error' | 'pending' | 'success'
}) {
  if (status === 'pending')
    return (
      <div className="flex justify-center py-8">
        <img
          alt="Loading"
          className="h-10 w-10 animate-spin grayscale"
          src="/pokemon-icon.svg"
        />
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
