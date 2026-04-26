import { useRef } from 'react'

export type SwipeDirection = 'down' | 'left' | 'right' | 'up'

export function useSwipeGesture(
  onSwipe: (direction: SwipeDirection) => void,
  threshold = 50
) {
  const touchStart = useRef<null | { x: number; y: number }>(null)

  function onTouchStart(e: React.TouchEvent) {
    if (!e.touches[0]) return
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
  }

  function onTouchEnd(e: React.TouchEvent) {
    if (!touchStart.current || !e.changedTouches[0]) return
    const dx = e.changedTouches[0].clientX - touchStart.current.x
    const dy = e.changedTouches[0].clientY - touchStart.current.y
    touchStart.current = null

    const adx = Math.abs(dx)
    const ady = Math.abs(dy)

    if (Math.max(adx, ady) < threshold) return

    if (adx >= ady) onSwipe(dx < 0 ? 'left' : 'right')
    else onSwipe(dy < 0 ? 'up' : 'down')
  }

  return { onTouchEnd, onTouchStart }
}
