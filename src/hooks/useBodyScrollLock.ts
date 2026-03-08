import { useEffect } from 'react'

export function useBodyScrollLock(active: boolean, onClose: () => void) {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    if (active) {
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth
      document.body.style.overflow = 'hidden'
      document.body.style.paddingRight = `${scrollbarWidth}px`
      window.addEventListener('keydown', onKeyDown)
    } else {
      document.body.style.overflow = 'auto'
      document.body.style.paddingRight = ''
    }
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [active, onClose])
}
