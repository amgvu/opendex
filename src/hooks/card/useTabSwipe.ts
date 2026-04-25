import { useSwipeGesture } from './useSwipeGesture'

const TABS = ['stats', 'bio', 'moves', 'evo'] as const

export function useTabSwipe(
  activeTab: (typeof TABS)[number],
  setActiveTab: (tab: (typeof TABS)[number]) => void
) {
  return useSwipeGesture(direction => {
    if (direction !== 'left' && direction !== 'right') return
    const idx = TABS.indexOf(activeTab)
    if (direction === 'left' && idx < TABS.length - 1) setActiveTab(TABS[idx + 1])
    if (direction === 'right' && idx > 0) setActiveTab(TABS[idx - 1])
  })
}
