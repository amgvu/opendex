import { useEffect, useState } from 'react'

export function useGifLoader(gifEnabled: boolean, resetKey?: unknown) {
  const [gifMounted, setGifMounted] = useState(gifEnabled)
  const [gifReady, setGifReady] = useState(false)
  const [gifError, setGifError] = useState(false)

  useEffect(() => {
    if (gifEnabled) setGifMounted(true)
  }, [gifEnabled])

  useEffect(() => {
    setGifReady(false)
    setGifError(false)
  }, [resetKey])

  return { gifError, gifMounted, gifReady, setGifError, setGifReady }
}
