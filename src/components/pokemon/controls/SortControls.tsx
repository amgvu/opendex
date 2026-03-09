import { TbArrowDown, TbArrowUp } from 'react-icons/tb'

import type { SortField, SortOrder } from '@/types/sort'

import { SORT_FIELDS } from '@/types/sort'

import { Button } from '../../ui/button'

export function SortControls({
  onSort,
  sortBy,
  sortOrder
}: {
  onSort: (field: SortField) => void
  sortBy: SortField
  sortOrder: SortOrder
}) {
  return (
    <div className="flex flex-wrap gap-1">
      {SORT_FIELDS.map(({ field, label }) => {
        const active = sortBy === field
        return (
          <Button
            key={field}
            onClick={() => onSort(field)}
            size="sm"
            variant={active ? 'default' : 'secondary'}
          >
            {label}
            {active &&
              (sortOrder === 'asc' ? (
                <TbArrowUp size={12} />
              ) : (
                <TbArrowDown size={12} />
              ))}
          </Button>
        )
      })}
    </div>
  )
}
