import { type PointerEvent, useRef, useState } from 'react'

export function useGifHover() {
  const [hovered, setHovered] = useState(false)
  const [gifMounted, setGifMounted] = useState(false)
  const [gifReady, setGifReady] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function onPointerMove(e: PointerEvent) {
    if (e.pointerType !== 'mouse') return
    setGifMounted(true)
    if (!timerRef.current) {
      timerRef.current = setTimeout(() => setHovered(true), 500)
    }
  }

  function onPointerLeave(e: PointerEvent) {
    if (e.pointerType !== 'mouse') return
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    setHovered(false)
  }

  function onClick() {
    setGifMounted(true)
    setHovered(h => !h)
  }

  return {
    gifMounted,
    gifReady,
    hovered,
    onClick,
    onPointerLeave,
    onPointerMove,
    setGifReady
  }
}
