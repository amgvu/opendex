import { useRouter, useSearchParams } from 'next/navigation'
import { useRef } from 'react'

export function useUrlSync() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const searchParamsRef = useRef(searchParams)
  const routerRef = useRef(router)

  searchParamsRef.current = searchParams
  routerRef.current = router

  return { routerRef, searchParamsRef }
}
