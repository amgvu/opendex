import { ChevronDown } from 'lucide-react'

import { colors, getTypeColor } from '@/lib/pokemon'
import { useFilterStore } from '@/stores/filterStore'

import { Button } from '../../ui/button'
import { Checkbox } from '../../ui/checkbox'
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover'

const ALL_TYPES = Object.keys(colors).sort()
const ALL_GENS = [1, 2, 3, 4, 5, 6, 7, 8, 9]

export function FilterControls() {
  const selectedGens = useFilterStore(s => s.selectedGens)
  const selectedTypes = useFilterStore(s => s.selectedTypes)
  const toggleGen = useFilterStore(s => s.toggleGen)
  const toggleType = useFilterStore(s => s.toggleType)

  return (
    <div className="flex flex-wrap gap-3">
      <div className="flex flex-wrap items-center">
        <span className="w-8 text-xs font-semibold text-muted-foreground">
          Type
        </span>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              className="h-8 px-3 text-xs font-semibold"
              variant="outline"
            >
              {selectedTypes.length > 0
                ? `${selectedTypes.length} selected`
                : 'Any'}
              <ChevronDown size={12} />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-56 p-3">
            <div className="grid grid-cols-2 gap-1.5">
              {ALL_TYPES.map(type => {
                const checked = selectedTypes.includes(type)
                return (
                  <label
                    className={`flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-white transition-opacity ${getTypeColor(type)} ${checked ? 'opacity-100' : 'opacity-40'}`}
                    key={type}
                  >
                    <Checkbox
                      checked={checked}
                      className="h-4 w-4 border-white data-[state=checked]:bg-white data-[state=checked]:text-black"
                      onCheckedChange={() => toggleType(type)}
                    />
                    {type}
                  </label>
                )
              })}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex flex-wrap items-center">
        <span className="w-8 text-xs font-semibold text-muted-foreground">
          Gen
        </span>
        <div className="flex flex-wrap gap-1">
          {ALL_GENS.map(gen => (
            <Button
              key={gen}
              onClick={() => toggleGen(gen)}
              size="sm"
              variant={selectedGens.includes(gen) ? 'default' : 'secondary'}
            >
              {gen}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
