import { getTypeColor } from '@/lib/pokemon'

export function TypeBadge({ type }: { type: string }) {
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-medium text-white ${getTypeColor(type)}`}
    >
      {type}
    </span>
  )
}
