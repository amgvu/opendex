import { useEffect, useRef } from 'react'

export function useOutsideClick(
  ref: React.RefObject<HTMLElement | null>,
  callback: () => void,
  active: boolean
) {
  const callbackRef = useRef(callback)
  callbackRef.current = callback

  useEffect(() => {
    if (!active) return

    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        callbackRef.current()
      }
    }

    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [ref, active])
}
