import { useWindowVirtualizer } from '@tanstack/react-virtual'
import { useCallback, useEffect, useState } from 'react'

import type { PokemonListEntry } from '@/lib/types'

const CARD_HEIGHT = 80
const GAP = 16
const PRELOAD_ROWS = 5
const OVERSCAN = 2

const preloadedUrls = new Set<string>()

export function useVirtualGrid(
  pokemon: PokemonListEntry[],
  onLoadMore: () => void,
  hasNextPage: boolean,
  isFetchingNextPage: boolean
) {
  const [columns, setColumns] = useState(getColumnCount)

  useEffect(() => {
    function handleResize() {
      setColumns(getColumnCount())
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const rowCount = Math.ceil(pokemon.length / columns)

  const virtualizer = useWindowVirtualizer({
    count: rowCount,
    estimateSize: useCallback(() => CARD_HEIGHT + GAP, []),
    overscan: OVERSCAN
  })

  const virtualItems = virtualizer.getVirtualItems()

  useEffect(() => {
    const lastItem = virtualItems[virtualItems.length - 1]
    if (!lastItem) return
    if (lastItem.index >= rowCount - OVERSCAN - 3 && hasNextPage && !isFetchingNextPage) {
      onLoadMore()
    }
    const preloadStart = (lastItem.index + 1) * columns
    const preloadEnd = Math.min(preloadStart + PRELOAD_ROWS * columns, pokemon.length)
    for (let i = preloadStart; i < preloadEnd; i++) {
      const url = pokemon[i]?.officialUrl
      if (url && !preloadedUrls.has(url)) {
        preloadedUrls.add(url)
        if ('requestIdleCallback' in window) {
          requestIdleCallback(() => { new Image().src = url })
        } else {
          setTimeout(() => { new Image().src = url }, 0)
        }
      }
    }
  }, [virtualItems, rowCount, hasNextPage, isFetchingNextPage, onLoadMore, columns, pokemon])

  function getRowPokemon(rowIndex: number): PokemonListEntry[] {
    const start = rowIndex * columns
    return pokemon.slice(start, start + columns)
  }

  return {
    columns,
    getRowPokemon,
    measureElement: virtualizer.measureElement,
    totalHeight: virtualizer.getTotalSize(),
    virtualItems
  }
}

function getColumnCount() {
  if (typeof window === 'undefined') return 5
  if (window.innerWidth >= 1536) return 6
  if (window.innerWidth >= 1024) return 5
  if (window.innerWidth >= 768) return 4
  if (window.innerWidth >= 640) return 3
  return 2
}
