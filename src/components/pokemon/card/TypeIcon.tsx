'use client'

import Image from 'next/image'

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { getTypeColor } from '@/lib/pokemon'

export function TypeIcon({ immune, multiplier, type }: { immune?: boolean; multiplier?: 0.25 | 0.5 | 2 | 4; type: string }) {
  const badgeLabel = multiplier === 0.25 ? '¼' : multiplier === 0.5 ? '½' : multiplier
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          className={`relative flex shrink-0 items-center justify-center rounded-md p-1 ${getTypeColor(type)} ${immune ? 'grayscale opacity-40' : ''} ${!multiplier && !immune ? 'opacity-50' : ''} ${multiplier === 4 ? 'ring-2 ring-white/70' : ''}`}
        >
          <Image alt="" aria-hidden="true" height={18} src={`/icons/${type.toLowerCase()}.svg`} unoptimized width={18} />
          {multiplier && (
            <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-black/70 text-[8px] font-bold leading-none text-white">
              {badgeLabel}
            </span>
          )}
        </span>
      </TooltipTrigger>
      <TooltipContent>
        {multiplier ? `${type} ×${multiplier}` : type}
      </TooltipContent>
    </Tooltip>
  )
}
