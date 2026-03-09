import { useWindowVirtualizer } from '@tanstack/react-virtual'
import { useCallback, useEffect } from 'react'

import type { Pokemon } from '@/types/pokemon'

import { useResponsiveColumns } from './useResponsiveColumns'

const CARD_HEIGHT = 80
const GAP = 16

export function useVirtualGrid(
  pokemon: Pokemon[],
  onLoadMore: () => void,
  hasNextPage: boolean,
  isFetchingNextPage: boolean
) {
  const columns = useResponsiveColumns()

  const rowCount = Math.ceil(pokemon.length / columns)

  const virtualizer = useWindowVirtualizer({
    count: rowCount,
    estimateSize: useCallback(() => CARD_HEIGHT + GAP, []),
    overscan: 5
  })

  const virtualItems = virtualizer.getVirtualItems()

  useEffect(() => {
    const lastItem = virtualItems[virtualItems.length - 1]
    if (!lastItem) return
    if (lastItem.index >= rowCount - 3 && hasNextPage && !isFetchingNextPage) {
      onLoadMore()
    }
  }, [virtualItems, rowCount, hasNextPage, isFetchingNextPage, onLoadMore])

  function getRowPokemon(rowIndex: number): Pokemon[] {
    const start = rowIndex * columns
    return pokemon.slice(start, start + columns)
  }

  return {
    columns,
    getRowPokemon,
    totalHeight: virtualizer.getTotalSize(),
    virtualItems
  }
}

