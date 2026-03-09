import { useEffect, useState } from 'react'

function getColumnCount() {
  if (typeof window === 'undefined') return 5
  if (window.innerWidth >= 1024) return 5
  if (window.innerWidth >= 768) return 4
  if (window.innerWidth >= 640) return 3
  return 2
}

export function useResponsiveColumns() {
  const [columns, setColumns] = useState(getColumnCount)

  useEffect(() => {
    function handleResize() {
      setColumns(getColumnCount())
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return columns
}
