import { useSwipeGesture } from './useSwipeGesture'

export function useArtworkSwipe(
  artworkCollapsed: boolean,
  setArtworkCollapsed: (v: boolean) => void
) {
  return useSwipeGesture(direction => {
    if (direction === 'up' && !artworkCollapsed) setArtworkCollapsed(true)
    if (direction === 'down' && artworkCollapsed) setArtworkCollapsed(false)
  }, 40)
}
