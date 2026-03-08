import { useEffect, useRef } from 'react'

export function useBodyScrollLock(active: boolean, onClose: () => void) {
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onCloseRef.current()
    }
    if (active) {
      document.documentElement.style.overflow = 'hidden'
      window.addEventListener('keydown', onKeyDown)
    } else {
      document.documentElement.style.overflow = ''
    }
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [active])
}
