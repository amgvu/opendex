import { useRef } from 'react'

const TABS = ['stats', 'bio', 'moves', 'evo'] as const
const SWIPE_THRESHOLD = 50

export function useTabSwipe(
  activeTab: (typeof TABS)[number],
  setActiveTab: (tab: (typeof TABS)[number]) => void
) {
  const touchStartX = useRef<null | number>(null)
  const touchStartY = useRef<null | number>(null)

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
  }

  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null || touchStartY.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    const dy = Math.abs(e.changedTouches[0].clientY - touchStartY.current)
    touchStartX.current = null
    touchStartY.current = null

    if (Math.abs(dx) < SWIPE_THRESHOLD || dy > Math.abs(dx)) return

    const idx = TABS.indexOf(activeTab)
    if (dx < 0 && idx < TABS.length - 1) setActiveTab(TABS[idx + 1])
    if (dx > 0 && idx > 0) setActiveTab(TABS[idx - 1])
  }

  return { onTouchEnd, onTouchStart }
}
