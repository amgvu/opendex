import { motion } from 'motion/react'
import Image from 'next/image'
import { useState } from 'react'
import { IoMdStar } from 'react-icons/io'
import { IoSparkles } from 'react-icons/io5'

import type { Pokemon } from '@/types/pokemon'

import { CARD_TRANSITION } from '@/lib/constants'
import { formatPokedexId, getTypeColor } from '@/lib/pokemon'

import { TypeBadge } from '../TypeBadge'

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
  const priority = index < 10
  const typeColor = getTypeColor(pokemon.types[0] ?? '')
  const [hovered, setHovered] = useState(false)
  const iconSrc = `/icons/${(pokemon.types[0] ?? 'normal').toLowerCase()}.svg`

  return (
    <motion.div
      animate={{ opacity: active ? 0 : 1, y: !active && hovered ? -3 : 0 }}
      className={`relative h-20 cursor-pointer rounded-xl p-3 [clip-path:inset(0_round_0.85rem)] ${typeColor}`}
      layoutId={`card-${pokemon.id}-${id}`}
      onClick={onClick}
      onHoverEnd={() => setHovered(false)}
      onHoverStart={() => {
        if (!active) setHovered(true)
      }}
      transition={CARD_TRANSITION}
    >
      <Image
        alt=""
        aria-hidden="true"
        className="absolute bottom-2 -left-9 h-[128px] w-[128px] scale-[1.5] origin-top-left opacity-20 grayscale"
        draggable={false}
        height={128}
        loading="eager"
        onContextMenu={e => e.preventDefault()}
        src={iconSrc}
        unoptimized
        width={128}
      />
      <motion.div
        className="absolute -bottom-4 left-16 sm:left-20 md:left-20 lg:left-22 xl:left-24 2xl:left-28 h-28 w-28"
        layoutId={`image-${pokemon.id}-${id}`}
        style={
          pokemon.blurDataURL
            ? {
                backgroundImage: `url(${pokemon.blurDataURL})`,
                backgroundPosition: 'center',
                backgroundSize: 'cover'
              }
            : undefined
        }
        transition={CARD_TRANSITION}
      >
        <Image
          alt={pokemon.name}
          className="h-28 w-28 object-contain drop-shadow-md"
          height={128}
          loading={priority ? undefined : 'lazy'}
          onLoad={e => {
            const img = e.currentTarget as HTMLImageElement
            img.style.opacity = '1'
            if (img.parentElement)
              img.parentElement.style.backgroundImage = 'none'
          }}
          priority={priority}
          sizes="112px"
          src={pokemon.officialUrl}
          style={{ opacity: 0, transition: 'opacity 0.2s' }}
          unoptimized
          width={128}
        />
      </motion.div>
      <div className="relative flex h-full flex-col justify-between">
        <div className="flex items-start justify-between gap-1">
          <motion.p
            className={`min-w-0 truncate font-semibold capitalize text-white ${pokemon.name.length > 14 ? 'text-xs sm:text-sm 2xl:text-base' : 'text-sm sm:text-base lg:text-lg 2xl:text-xl'}`}
            layoutId={`name-${pokemon.id}-${id}`}
            transition={CARD_TRANSITION}
          >
            {pokemon.name}
          </motion.p>
          <span className="flex-shrink-0 text-[10px] sm:text-xs 2xl:text-sm tracking-wide font-semibold text-white">
            {formatPokedexId(pokemon.id)}
          </span>
        </div>
        <motion.div
          className="relative flex flex-wrap gap-1"
          layoutId={`types-${pokemon.id}-${id}`}
          transition={CARD_TRANSITION}
        >
          {pokemon.types.map((type: string) => (
            <TypeBadge key={type} type={type} />
          ))}
        </motion.div>
      </div>
      {(pokemon.isLegendary || pokemon.isMythical) && (
        <motion.div
          className="absolute bottom-2 right-2"
          layoutId={`star-${pokemon.id}-${id}`}
          transition={CARD_TRANSITION}
        >
          {pokemon.isMythical
            ? <IoSparkles className="text-pink-400" size={16} />
            : <IoMdStar className="text-yellow-400" size={18} />
          }
        </motion.div>
      )}
    </motion.div>
  )
}
