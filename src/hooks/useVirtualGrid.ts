import { useWindowVirtualizer } from '@tanstack/react-virtual'
import { useCallback, useEffect, useRef } from 'react'

import type { Pokemon } from '@/types/pokemon'

import { useResponsiveColumns } from './useResponsiveColumns'

const CARD_HEIGHT = 80
const GAP = 16

export function useVirtualGrid(
  pokemon: Pokemon[],
  selectedId: null | number,
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

  function scrollToRow(pokemonIndex: number) {
    const rowIndex = Math.floor(pokemonIndex / columns)
    virtualizer.scrollToIndex(rowIndex, { align: 'center', behavior: 'smooth' })
  }

  const pokemonRef = useRef(pokemon)
  pokemonRef.current = pokemon
  const columnsRef = useRef(columns)
  columnsRef.current = columns
  const virtualItemsRef = useRef(virtualItems)
  virtualItemsRef.current = virtualItems
  const scrollToRowRef = useRef(scrollToRow)
  scrollToRowRef.current = scrollToRow

  useEffect(() => {
    if (selectedId === null) return
    const idx = pokemonRef.current.findIndex(p => p.id === selectedId)
    if (idx === -1) return
    const rowIndex = Math.floor(idx / columnsRef.current)
    const virtualRow = virtualItemsRef.current.find(item => item.index === rowIndex)
    if (!virtualRow) {
      scrollToRowRef.current(idx)
      return
    }
    const buffer = virtualRow.size * 2
    const viewportTop = window.scrollY + buffer
    const viewportBottom = window.scrollY + window.innerHeight - buffer
    const isVisible =
      virtualRow.start < viewportBottom &&
      virtualRow.start + virtualRow.size > viewportTop
    if (!isVisible) scrollToRowRef.current(idx)
  }, [selectedId])

  return {
    columns,
    getRowPokemon,
    measureElement: virtualizer.measureElement,
    totalHeight: virtualizer.getTotalSize(),
    virtualItems
  }
}

