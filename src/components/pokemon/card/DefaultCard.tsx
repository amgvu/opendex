import { motion } from 'motion/react'
import Image from 'next/image'
import { useState } from 'react'
import { IoMdStar } from 'react-icons/io'

import type { Pokemon } from '@/types/pokemon'

import { CARD_TRANSITION } from '@/lib/constants'
import { formatPokedexId, getTypeColor } from '@/lib/pokemon'

import { TypeBadge } from './TypeBadge'

const loadedUrls = new Set<string>()

const PRIORITY_THRESHOLD = 10
const EAGER_THRESHOLD = 50

export function DefaultCard({
  active,
  id,
  index,
  onClick,
  pokemon
}: {
  active: boolean
  id: string
  index: number
  onClick: () => void
  pokemon: Pokemon
}) {
  const priority = index < PRIORITY_THRESHOLD
  const eager = index < EAGER_THRESHOLD
  const typeColor = getTypeColor(pokemon.types[0] ?? '')
  const [hovered, setHovered] = useState(false)
  const iconSrc = `/icons/${(pokemon.types[0] ?? 'normal').toLowerCase()}.svg`
  const [imageLoaded, setImageLoaded] = useState(() =>
    eager || loadedUrls.has(pokemon.officialUrl)
  )
  const [iconLoaded, setIconLoaded] = useState(() => loadedUrls.has(iconSrc))

  return (
    <motion.div
      animate={{ opacity: active ? 0 : 1, y: !active && hovered ? -3 : 0 }}
      className={`relative h-20 cursor-pointer rounded-xl p-3 [clip-path:inset(0_round_0.75rem)] ${typeColor}`}
      layoutId={`card-${pokemon.id}-${id}`}
      onClick={onClick}
      onHoverEnd={() => setHovered(false)}
      onHoverStart={() => {
        if (!active) setHovered(true)
      }}
      transition={CARD_TRANSITION}
    >
      <div className="absolute inset-0 bg-white/15" />
      <motion.div
        animate={{ opacity: iconLoaded ? 0.3 : 0 }}
        className="absolute -bottom-4 -right-4 grayscale"
        initial={false}
        transition={{ duration: 0.2 }}
      >
        <Image
          alt=""
          aria-hidden="true"
          height={96}
          onLoad={() => {
            loadedUrls.add(iconSrc)
            setIconLoaded(true)
          }}
          src={iconSrc}
          unoptimized
          width={96}
        />
      </motion.div>
      <motion.div
        className="absolute -bottom-4 left-16 sm:left-22 md:left-24 lg:left-26 xl:left-28 h-28 w-28"
        layoutId={`image-${pokemon.id}-${id}`}
        transition={CARD_TRANSITION}
      >
        <motion.div
          animate={{ opacity: imageLoaded ? 1 : 0 }}
          initial={false}
          transition={{ duration: 0.2 }}
        >
          <Image
            alt={pokemon.name}
            className="h-28 w-28 object-contain drop-shadow-md"
            loading={priority ? undefined : 'lazy'}
            onLoad={() => {
              loadedUrls.add(pokemon.officialUrl)
              setImageLoaded(true)
            }}
            priority={priority}
            sizes="112px"
            src={pokemon.officialUrl}
            unoptimized
            width={128}
            height={128}
          />
        </motion.div>
      </motion.div>
      <div className="relative flex items-start justify-between">
        <motion.p
          className="text-sm sm:text-base lg:text-lg font-semibold capitalize text-white"
          layoutId={`name-${pokemon.id}-${id}`}
          transition={CARD_TRANSITION}
        >
          {pokemon.name}
        </motion.p>
        <span className="text-[10px] sm:text-xs tracking-wide font-semibold text-white">
          {formatPokedexId(pokemon.id)}
        </span>
      </div>
      <motion.div
        className="relative mt-2 flex flex-wrap gap-1"
        layoutId={`types-${pokemon.id}-${id}`}
        transition={CARD_TRANSITION}
      >
        {pokemon.types.map((type: string) => (
          <TypeBadge key={type} type={type} />
        ))}
      </motion.div>
      {pokemon.isLegendary && (
        <motion.div
          className="absolute bottom-2 right-2"
          layoutId={`star-${pokemon.id}-${id}`}
          transition={CARD_TRANSITION}
        >
          <IoMdStar className="text-yellow-400" size={18} />
        </motion.div>
      )}
    </motion.div>
  )
}
