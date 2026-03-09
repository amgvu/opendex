import { useEffect, useRef } from 'react'

export function useBodyScrollLock(active: boolean, onClose: () => void) {
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useEffect(() => {
    if (!active) return

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onCloseRef.current()
    }

    document.documentElement.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.documentElement.style.overflow = ''
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [active])
}
