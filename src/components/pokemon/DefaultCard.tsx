import { motion } from 'motion/react'
import Image from 'next/image'
import { useState } from 'react'
import { IoMdStar } from 'react-icons/io'

import type { Pokemon } from '@/types/pokemon'

import { CARD_TRANSITION } from '@/lib/constants'
import { formatPokedexId, getTypeColor } from '@/lib/pokemon'

import { TypeBadge } from './TypeBadge'

export function DefaultCard({
  active,
  id,
  onClick,
  pokemon
}: {
  active: boolean
  id: string
  onClick: () => void
  pokemon: Pokemon
}) {
  const typeColor = getTypeColor(pokemon.types[0] ?? '')
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      animate={{ opacity: active ? 0 : 1, y: !active && hovered ? -3 : 0 }}
      className={`relative h-full cursor-pointer overflow-hidden rounded-xl p-3 ${typeColor}`}
      initial={{ opacity: 0 }}
      layoutId={`card-${pokemon.id}-${id}`}
      onClick={onClick}
      onHoverEnd={() => setHovered(false)}
      onHoverStart={() => {
        if (!active) setHovered(true)
      }}
      transition={CARD_TRANSITION}
    >
      <div className="absolute inset-0 bg-white/15" />
      <Image
        alt=""
        aria-hidden="true"
        className="absolute -bottom-4 -right-4 opacity-20 grayscale"
        height={96}
        src={`/icons/${(pokemon.types[0] ?? 'normal').toLowerCase()}.svg`}
        unoptimized
        width={96}
      />
      <motion.div
        className="absolute -bottom-6 left-24 md:-bottom-6 md:left-28 h-28 w-28"
        layoutId={`image-${pokemon.id}-${id}`}
        transition={CARD_TRANSITION}
      >
        <Image
          alt={pokemon.name}
          className="h-28 w-28 object-contain drop-shadow-md"
          height={128}
          loading="lazy"
          sizes="112px"
          src={pokemon.officialUrl}
          unoptimized
          width={128}
        />
      </motion.div>
      <div className="relative flex items-start justify-between">
        <motion.p
          className="text-lg font-semibold capitalize text-white"
          layoutId={`name-${pokemon.id}-${id}`}
          transition={CARD_TRANSITION}
        >
          {pokemon.name}
        </motion.p>
        <span className="text-xs tracking-wide font-semibold text-white">
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
