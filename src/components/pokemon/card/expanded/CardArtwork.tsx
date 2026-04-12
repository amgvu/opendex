import { Label, Switch } from '@heroui/react'
import { motion } from 'motion/react'
import Image from 'next/image'
import {
  type CSSProperties,
  type SyntheticEvent,
  useEffect,
  useRef,
  useState
} from 'react'

import type { Pokemon } from '@/types/pokemon'

import { useCardContext } from '@/context/card'
import { CARD_TRANSITION } from '@/lib/constants'
import { bgClassToVar } from '@/lib/pokemon'

export function CardArtwork({
  id,
  pokemon,
  typeColor
}: {
  id: string
  pokemon: Pokemon
  typeColor: string
}) {
  const { gifEnabled, setGifEnabled } = useCardContext()
  const [gifMounted, setGifMounted] = useState(gifEnabled)
  const [gifReady, setGifReady] = useState(false)
  const [gifError, setGifError] = useState(false)
  const blurRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (gifEnabled) setGifMounted(true)
  }, [gifEnabled])

  function handleArtworkLoad(e: SyntheticEvent<HTMLImageElement>) {
    e.currentTarget.style.opacity = '1'
    if (blurRef.current) blurRef.current.style.backgroundImage = 'none'
  }

  const artworkImage = (
    <Image
      alt={pokemon.name}
      className="h-36 w-36 xl:h-64 xl:w-64 2xl:h-80 2xl:w-80 object-contain"
      height={384}
      onLoad={handleArtworkLoad}
      sizes="(min-width: 1536px) 320px, 200px"
      src={pokemon.officialUrl}
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
      layoutId={`image-${pokemon.id}-${id}`}
      transition={CARD_TRANSITION}
    >
      <div
        className="relative h-36 w-36 xl:h-64 xl:w-64 2xl:h-80 2xl:w-80"
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
          initial={{ opacity: 0 }}
          onError={() => setGifError(true)}
          onLoad={() => setGifReady(true)}
          src={pokemon.imageUrl}
          transition={{ duration: 0.15 }}
        />
      )}
      {!gifError && (
        <div className="absolute bottom-0 right-0">
          <Switch
            isSelected={gifEnabled}
            onChange={v => {
              if (v) setGifMounted(true)
              setGifEnabled(v)
            }}
            size="sm"
            style={
              {
                '--switch-control-bg': `color-mix(in oklab, ${bgClassToVar(typeColor)}, white 40%)`,
                '--switch-control-bg-checked': bgClassToVar(typeColor),
                '--switch-control-bg-checked-hover': bgClassToVar(typeColor),
                '--switch-control-bg-hover': `color-mix(in oklab, ${bgClassToVar(typeColor)}, white 30%)`
              } as CSSProperties
            }
          >
            <Switch.Control>
              <Switch.Thumb />
            </Switch.Control>
            <Switch.Content>
              <Label className="text-xs font-medium text-white/70 select-none">
                3D
              </Label>
            </Switch.Content>
          </Switch>
        </div>
      )}
    </motion.div>
  )
}
