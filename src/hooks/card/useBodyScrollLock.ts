import { useEffect, useRef } from 'react'

export function useBodyScrollLock(active: boolean, onClose: () => void) {
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useEffect(() => {
    if (!active) return

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onCloseRef.current()
    }

    function onTouchMove(e: TouchEvent) {
      let el = e.target as Element | null
      while (el && el !== document.body) {
        const { overflowY } = window.getComputedStyle(el)
        if ((overflowY === 'auto' || overflowY === 'scroll') && el.scrollHeight > el.clientHeight) {
          return
        }
        el = el.parentElement
      }
      e.preventDefault()
    }

    document.documentElement.style.overflow = 'hidden'
    document.addEventListener('touchmove', onTouchMove, { passive: false })
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.documentElement.style.overflow = ''
      document.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [active])
}
