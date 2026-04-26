import { useRef } from 'react'

const SWIPE_THRESHOLD = 40
const DISMISS_TOP_THRESHOLD = 80

export function useArtworkSwipe(
  artworkCollapsed: boolean,
  setArtworkCollapsed: (v: boolean) => void,
  onDismiss?: () => void
) {
  const touchStart = useRef<{ x: number; y: number } | null>(null)

  function onTouchStart(e: React.TouchEvent) {
    if (!e.touches[0]) return
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
  }

  function onTouchEnd(e: React.TouchEvent) {
    if (!touchStart.current || !e.changedTouches[0]) return
    const dx = e.changedTouches[0].clientX - touchStart.current.x
    const dy = e.changedTouches[0].clientY - touchStart.current.y
    const startY = touchStart.current.y
    touchStart.current = null

    const adx = Math.abs(dx)
    const ady = Math.abs(dy)

    if (Math.max(adx, ady) < SWIPE_THRESHOLD || adx >= ady) return
    if (dy < 0 && !artworkCollapsed) return setArtworkCollapsed(true)
    if (dy > 0 && startY <= DISMISS_TOP_THRESHOLD) return onDismiss?.()
    if (dy > 0 && artworkCollapsed) setArtworkCollapsed(false)
  }

  return { onTouchEnd, onTouchStart }
}
