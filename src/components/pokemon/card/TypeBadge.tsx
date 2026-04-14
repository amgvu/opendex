import { bgClassToVar, getTypeColor } from '@/lib/pokemon'

export function TypeBadge({
  size = 'sm',
  type
}: {
  size?: 'lg' | 'sm'
  type: string
}) {
  const sizeClass =
    size === 'lg'
      ? 'px-2 py-0.5 text-xs xl:px-3 xl:py-1 xl:text-sm 2xl:px-4 2xl:py-1.5 2xl:text-base'
      : 'px-1.5 py-0.5 text-[10px] sm:px-2 sm:text-xs 2xl:px-2.5 2xl:text-sm'
  const hex = bgClassToVar(getTypeColor(type))
  return (
    <span
      className={`rounded-full font-medium text-white border ${sizeClass} ${getTypeColor(type)}`}
      style={{
        borderColor: `color-mix(in srgb, ${hex} 70%, white)`,
        boxShadow: `0 2px 6px color-mix(in srgb, ${hex} 80%, black)`
      }}
    >
      {type}
    </span>
  )
}
