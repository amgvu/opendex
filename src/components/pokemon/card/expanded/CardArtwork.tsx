import { motion } from 'motion/react'
import Image from 'next/image'
import { type SyntheticEvent, useRef } from 'react'

import type { PokemonEntry } from '@/types/pokemon'

import { CARD_TRANSITION } from '@/lib/constants'
import { useCardStore } from '@/stores/cardStore'
export function CardArtwork({
  gifError,
  gifMounted,
  gifReady,
  id,
  pokemon,
  setGifError,
  setGifReady
}: {
  gifError: boolean
  gifMounted: boolean
  gifReady: boolean
  id: string
  pokemon: PokemonEntry
  setGifError: (v: boolean) => void
  setGifReady: (v: boolean) => void
}) {
  const { gifEnabled, shinyEnabled } = useCardStore()

  const blurRef = useRef<HTMLDivElement>(null)

  const artSrc = shinyEnabled
    ? (pokemon.shiny?.officialUrl ?? pokemon.officialUrl)
    : pokemon.officialUrl
  const gifSrc = shinyEnabled
    ? (pokemon.shiny?.imageUrl ?? pokemon.imageUrl)
    : pokemon.imageUrl

  function handleArtworkLoad(e: SyntheticEvent<HTMLImageElement>) {
    e.currentTarget.style.opacity = '1'
    if (blurRef.current) blurRef.current.style.backgroundImage = 'none'
  }

  const artworkImage = (
    <Image
      alt={pokemon.name}
      className="h-56 w-56 sm:h-40 sm:w-40 xl:h-64 xl:w-64 2xl:h-80 2xl:w-80 object-contain"
      draggable={false}
      height={384}
      onContextMenu={e => e.preventDefault()}
      onLoad={handleArtworkLoad}
      sizes="(min-width: 1536px) 320px, (min-width: 1280px) 256px, (min-width: 640px) 160px, 224px"
      src={artSrc}
      style={{
        opacity: 0,
        transition: 'opacity 0.2s'
      }}
      unoptimized
      width={384}
    />
  )

  return (
    <motion.div
      className="relative flex justify-center"
      layoutId={`image-${pokemon.name}-${id}`}
      transition={CARD_TRANSITION}
    >
      <div
        className="relative h-56 w-56 sm:h-40 sm:w-40 xl:h-64 xl:w-64 2xl:h-80 2xl:w-80"
        ref={blurRef}
        style={
          pokemon.blurDataURL
            ? {
                backgroundImage: `url(${pokemon.blurDataURL})`,
                backgroundPosition: 'center',
                backgroundSize: 'cover'
              }
            : undefined
        }
      >
        <motion.div
          animate={{ opacity: gifError || !gifEnabled ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {artworkImage}
        </motion.div>
      </div>
      {!gifError && gifMounted && (
        <motion.img
          alt=""
          animate={{ opacity: gifEnabled && gifReady ? 1 : 0 }}
          className="absolute h-56 w-56 sm:h-40 sm:w-40 xl:h-64 xl:w-64 2xl:h-80 2xl:w-80 object-contain"
          draggable={false}
          initial={{ opacity: 0 }}
          onContextMenu={e => e.preventDefault()}
          onError={() => setGifError(true)}
          onLoad={() => setGifReady(true)}
          src={gifSrc}
          transition={{ duration: 0.15 }}
        />
      )}
    </motion.div>
  )
}
