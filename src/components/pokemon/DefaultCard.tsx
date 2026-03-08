import { motion } from 'motion/react'
import Image from 'next/image'
import { IoMdStar } from 'react-icons/io'

import type { Pokemon } from '@/types/pokemon'

import { getTypeColor } from '@/lib/pokemon'

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

  return (
    <motion.div
      animate={{ opacity: active ? 0 : 1 }}
      className={`relative h-full cursor-pointer overflow-hidden rounded-xl p-3 ${typeColor}`}
      initial={{ opacity: 0 }}
      layoutId={`card-${pokemon.id}-${id}`}
      onClick={onClick}
      transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
      whileHover={
        active
          ? undefined
          : { transition: { duration: 0.1, ease: 'easeOut' }, y: -3 }
      }
    >
      <div className="absolute inset-0 bg-white/15" />
      <Image
        alt=""
        aria-hidden="true"
        className="absolute -bottom-4 -right-4 opacity-20 grayscale"
        height={96}
        src={`/icons/${(pokemon.types[0] ?? 'normal').toLowerCase()}.svg`}
        width={96}
      />
      <div className="relative flex items-start justify-between">
        <motion.p
          className="text-sm font-semibold capitalize text-white"
          layoutId={`name-${pokemon.id}-${id}`}
          transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
        >
          {pokemon.name}
        </motion.p>
        <span className="text-xs font-semibold text-white">#{pokemon.id}</span>
      </div>
      <motion.div
        className="relative mt-2 flex flex-wrap gap-1"
        layoutId={`types-${pokemon.id}-${id}`}
        transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
      >
        {pokemon.types.map((type: string) => (
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium text-white ${getTypeColor(type)}`}
            key={type}
          >
            {type}
          </span>
        ))}
      </motion.div>
      {pokemon.isLegendary && (
        <motion.div
          className="absolute bottom-2 right-2"
          layoutId={`star-${pokemon.id}-${id}`}
          transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
        >
          <IoMdStar className="text-yellow-400" size={18} />
        </motion.div>
      )}
    </motion.div>
  )
}
