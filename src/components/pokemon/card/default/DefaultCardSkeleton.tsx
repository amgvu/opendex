export function DefaultCardSkeleton() {
  return (
    <div className="relative h-20 overflow-hidden rounded-xl bg-muted p-3 animate-pulse">
      <div className="absolute -bottom-4 left-16 h-28 w-28 rounded-full bg-foreground/10 sm:left-20 md:left-20 lg:left-22 xl:left-24 2xl:left-28" />
      <div className="relative flex h-full flex-col justify-between">
        <div className="flex items-center justify-between gap-1">
          <div className="h-4 w-24 rounded bg-foreground/10" />
          <div className="h-3 w-10 rounded bg-foreground/10" />
        </div>
        <div className="h-5 w-14 rounded-full bg-foreground/10" />
      </div>
    </div>
  )
}
