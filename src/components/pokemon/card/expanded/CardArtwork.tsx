import { motion } from 'motion/react'
import Image from 'next/image'
import { type SyntheticEvent, useRef, useState } from 'react'
import { TbCheck, TbLink } from 'react-icons/tb'

import type { PokemonEntry } from '@/types/pokemon'

import { useCardContext } from '@/context/card'
import { useGifLoader } from '@/hooks/card/useGifLoader'
import { CARD_TRANSITION } from '@/lib/constants'
import { bgClassToVar } from '@/lib/pokemon'

import { ArtworkSwitches } from '../ArtworkSwitches'

export function CardArtwork({
  id,
  pokemon,
  typeColor
}: {
  id: string
  pokemon: PokemonEntry
  typeColor: string
}) {
  const { gifEnabled, setGifEnabled, setShinyEnabled, shinyEnabled } =
    useCardContext()
  const { gifError, gifMounted, gifReady, setGifError, setGifReady } =
    useGifLoader(gifEnabled, shinyEnabled)
  const [copied, setCopied] = useState(false)
  const blurRef = useRef<HTMLDivElement>(null)

  const artSrc = shinyEnabled
    ? (pokemon.shiny?.officialUrl ?? pokemon.officialUrl)
    : pokemon.officialUrl
  const gifSrc = shinyEnabled
    ? (pokemon.shiny?.imageUrl ?? pokemon.imageUrl)
    : pokemon.imageUrl

  function handleCopy() {
    const params = new URLSearchParams(window.location.search)
    params.set('pokemon', pokemon.name)
    const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`
    void navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  function handleArtworkLoad(e: SyntheticEvent<HTMLImageElement>) {
    e.currentTarget.style.opacity = '1'
    if (blurRef.current) blurRef.current.style.backgroundImage = 'none'
  }

  const artworkImage = (
    <Image
      alt={pokemon.name}
      className="h-36 w-36 xl:h-64 xl:w-64 2xl:h-80 2xl:w-80 object-contain"
      draggable={false}
      height={384}
      onContextMenu={e => e.preventDefault()}
      onLoad={handleArtworkLoad}
      sizes="(min-width: 1536px) 320px, 200px"
      src={artSrc}
      style={{
        filter: `drop-shadow(0 25px 25px color-mix(in oklab, ${bgClassToVar(typeColor)}, black 40%))`,
        opacity: 0,
        transition: 'opacity 0.2s'
      }}
      unoptimized
      width={384}
    />
  )

  return (
    <motion.div
      className="relative mb-1 sm:mb-4 flex justify-center"
      layoutId={`image-${pokemon.name}-${id}`}
      transition={CARD_TRANSITION}
    >
      <div
        className="relative h-45 w-45 xl:h-69 xl:w-69 2xl:h-85 2xl:w-85"
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
          className="absolute h-36 w-36 xl:h-64 xl:w-64 2xl:h-80 2xl:w-80 object-contain"
          draggable={false}
          initial={{ opacity: 0 }}
          onContextMenu={e => e.preventDefault()}
          onError={() => setGifError(true)}
          onLoad={() => setGifReady(true)}
          src={gifSrc}
          transition={{ duration: 0.15 }}
        />
      )}
      <div
        className="absolute bottom-0 left-0 right-0 flex items-center justify-between"
        data-no-drag
      >
        <button
          className="flex items-center gap-1 text-xs font-medium text-white/70 select-none cursor-pointer"
          onClick={handleCopy}
        >
          {copied ? <TbCheck size={16} /> : <TbLink size={16} />}
          <span>{copied ? 'Copied!' : 'Copy link'}</span>
        </button>
        <div className="flex items-center gap-2 scale-75 origin-right sm:scale-100">
          <ArtworkSwitches
            gifEnabled={gifEnabled}
            gifError={gifError}
            labelClassName="text-xs font-medium text-white/70 select-none"
            pokemon={pokemon}
            setGifEnabled={setGifEnabled}
            setShinyEnabled={setShinyEnabled}
            shinyEnabled={shinyEnabled}
            typeColor={typeColor}
          />
        </div>
      </div>
    </motion.div>
  )
}
