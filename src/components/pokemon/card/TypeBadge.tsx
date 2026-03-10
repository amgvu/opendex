import { getTypeColor } from '@/lib/pokemon'

export function TypeBadge({ size = 'sm', type }: { size?: 'lg' | 'sm'; type: string }) {
  const sizeClass = size === 'lg'
    ? 'px-2 py-0.5 text-xs xl:px-3 xl:py-1 xl:text-sm'
    : 'px-1.5 py-0.5 text-[10px] sm:px-2 sm:text-xs'
  return (
    <span
      className={`rounded-full font-medium text-white ${sizeClass} ${getTypeColor(type)}`}
    >
      {type}
    </span>
  )
}
