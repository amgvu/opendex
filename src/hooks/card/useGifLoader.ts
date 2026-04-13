import { useEffect, useState } from 'react'

export function useGifLoader(gifEnabled: boolean) {
  const [gifMounted, setGifMounted] = useState(gifEnabled)
  const [gifReady, setGifReady] = useState(false)
  const [gifError, setGifError] = useState(false)

  useEffect(() => {
    if (gifEnabled) setGifMounted(true)
  }, [gifEnabled])

  return { gifError, gifMounted, gifReady, setGifError, setGifReady }
}
