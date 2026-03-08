import { TbArrowDown, TbArrowUp } from 'react-icons/tb'

import type { SortField, SortOrder } from '@/types/sort'

import { SORT_FIELDS } from '@/types/sort'

export function SortControls({
  sortBy,
  sortOrder,
  onSort
}: {
  sortBy: SortField
  sortOrder: SortOrder
  onSort: (field: SortField) => void
}) {
  return (
    <div className="mb-4 flex flex-wrap gap-1">
      {SORT_FIELDS.map(({ field, label }) => {
        const active = sortBy === field
        return (
          <button
            className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
              active
                ? 'bg-foreground text-background'
                : 'bg-muted text-muted-foreground hover:bg-muted/70'
            }`}
            key={field}
            onClick={() => onSort(field)}
          >
            {label}
            {active &&
              (sortOrder === 'asc' ? (
                <TbArrowUp size={12} />
              ) : (
                <TbArrowDown size={12} />
              ))}
          </button>
        )
      })}
    </div>
  )
}
