import { getTypeColor } from '@/lib/pokemon'

export function TypeBadge({ type }: { type: string }) {
  return (
    <span
      className={`rounded-full px-1.5 py-0.5 text-[10px] sm:px-2 sm:text-xs font-medium text-white ${getTypeColor(type)}`}
    >
      {type}
    </span>
  )
}
