import { useEffect, useRef } from 'react'

export function useBodyScrollLock(active: boolean, onClose: () => void) {
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onCloseRef.current()
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
  }, [active])
}
