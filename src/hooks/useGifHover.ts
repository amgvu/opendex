import { type PointerEvent, useState } from 'react'

export function useGifHover() {
  const [hovered, setHovered] = useState(false)
  const [gifMounted, setGifMounted] = useState(false)
  const [gifReady, setGifReady] = useState(false)

  function onPointerMove(e: PointerEvent) {
    if (e.pointerType !== 'mouse') return
    setGifMounted(true)
    setHovered(true)
  }

  function onPointerLeave(e: PointerEvent) {
    if (e.pointerType === 'mouse') setHovered(false)
  }

  function onClick() {
    setGifMounted(true)
    setHovered(h => !h)
  }

  return { gifMounted, gifReady, hovered, onClick, onPointerLeave, onPointerMove, setGifReady }
}
