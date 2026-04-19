import { Check, ChevronDown, X } from 'lucide-react'
import { useMemo, useState } from 'react'

import { colors, getTypeColor } from '@/lib/pokemon'
import { useFilterStore } from '@/stores/filterStore'

import { Badge } from '../../ui/badge'
import { Button } from '../../ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList
} from '../../ui/command'
import { Popover, PopoverAnchor, PopoverContent } from '../../ui/popover'

const ALL_TYPES = Object.keys(colors).sort()
const ALL_GENS = [1, 2, 3, 4, 5, 6, 7, 8, 9]

export function FilterControls() {
  const [isTypePopoverOpen, setTypePopoverOpen] = useState(false)
  const [typeQuery, setTypeQuery] = useState('')
  const selectedGens = useFilterStore(s => s.selectedGens)
  const selectedTypes = useFilterStore(s => s.selectedTypes)
  const toggleGen = useFilterStore(s => s.toggleGen)
  const toggleType = useFilterStore(s => s.toggleType)
  const normalizedQuery = typeQuery.trim().toLowerCase()

  const filteredTypes = useMemo(() => {
    if (!normalizedQuery) return ALL_TYPES
    return ALL_TYPES.filter(type =>
      type.toLowerCase().includes(normalizedQuery)
    )
  }, [normalizedQuery])

  const addTypeFromInput = () => {
    if (!normalizedQuery) return

    const exactMatch = ALL_TYPES.find(
      type => type.toLowerCase() === normalizedQuery
    )
    const candidate = exactMatch ?? filteredTypes[0]
    if (!candidate) return

    if (!selectedTypes.includes(candidate)) toggleType(candidate)
    setTypeQuery('')
    setTypePopoverOpen(false)
  }

  return (
    <div className="flex flex-wrap gap-3">
      <div className="flex flex-wrap items-center">
        <span className="w-8 text-xs font-semibold text-muted-foreground">
          Type
        </span>
        <Popover onOpenChange={setTypePopoverOpen} open={isTypePopoverOpen}>
          <PopoverAnchor asChild>
            <div className="relative 2xl:w-64">
              <div
                className="border-input dark:bg-input/30 bg-transparent focus-within:border-ring focus-within:ring-ring/50 flex min-h-8 w-full flex-wrap items-center gap-1 rounded-md border px-2 py-1 text-xs shadow-xs transition-[color,box-shadow] focus-within:ring-[3px]"
                onClick={() => setTypePopoverOpen(true)}
              >
                {selectedTypes.map(type => (
                  <Badge
                    className={`gap-1 rounded-md px-1.5 py-0 text-[10px] text-white ${getTypeColor(type)}`}
                    key={type}
                  >
                    {type}
                    <button
                      className="cursor-pointer"
                      onClick={e => {
                        e.stopPropagation()
                        toggleType(type)
                      }}
                      type="button"
                    >
                      <X size={9} />
                    </button>
                  </Badge>
                ))}
                <input
                  className="placeholder:text-muted-foreground min-w-20 flex-1 bg-transparent py-0.5 text-xs outline-none"
                  onChange={e => {
                    setTypeQuery(e.target.value)
                    setTypePopoverOpen(true)
                  }}
                  onFocus={() => setTypePopoverOpen(true)}
                  onKeyDown={e => {
                    if (e.key !== 'Enter') return
                    e.preventDefault()
                    addTypeFromInput()
                  }}
                  placeholder={
                    selectedTypes.length > 0
                      ? 'Add type...'
                      : 'Search or add type...'
                  }
                  value={typeQuery}
                />
              </div>
              <button
                aria-label="Toggle type options"
                className="text-muted-foreground absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer"
                onClick={() => setTypePopoverOpen(prev => !prev)}
                type="button"
              >
                <ChevronDown size={14} />
              </button>
            </div>
          </PopoverAnchor>
          <PopoverContent align="start" className="w-64 p-2">
            <Command shouldFilter={false}>
              <CommandList className="max-h-56 touch-pan-y overscroll-contain">
                <CommandEmpty>No matching type</CommandEmpty>
                <CommandGroup>
                  {filteredTypes.map(type => {
                    const checked = selectedTypes.includes(type)
                    return (
                      <CommandItem
                        className="cursor-pointer text-xs"
                        key={type}
                        onSelect={() => {
                          toggleType(type)
                          setTypeQuery('')
                        }}
                        value={type}
                      >
                        <span
                          className={`mr-2 h-2.5 w-2.5 rounded-full ${getTypeColor(type)}`}
                        />
                        <span>{type}</span>
                        <Check
                          className={`ml-auto ${checked ? 'opacity-100' : 'opacity-0'}`}
                          size={14}
                        />
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
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
