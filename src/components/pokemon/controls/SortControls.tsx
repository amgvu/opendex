import { TbArrowDown, TbArrowUp } from 'react-icons/tb'

import { useFilterStore } from '@/stores/filterStore'
import { SORT_FIELDS } from '@/types/sort'

import { Button } from '../../ui/button'

export function SortControls() {
  const sortBy = useFilterStore(s => s.sortBy)
  const sortOrder = useFilterStore(s => s.sortOrder)
  const updateSort = useFilterStore(s => s.updateSort)

  return (
    <div className="flex flex-wrap gap-1">
      {SORT_FIELDS.map(({ field, label }) => {
        const active = sortBy === field
        return (
          <Button
            key={field}
            onClick={() => updateSort(field)}
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
