import { motion } from 'motion/react'
import { IoMdStar } from 'react-icons/io'
import { TbSparkles } from 'react-icons/tb'

import type { PokemonListEntry, PokemonListVariant } from '@/lib/types'

import { CARD_TRANSITION } from '@/lib/constants'
import { formatPokedexId, VARIANT_LABELS } from '@/lib/pokemon'

import { TypeBadge } from '../TypeBadge'

export function CardHeader({
  id,
  pokemon
}: {
  id: string
  pokemon: PokemonListEntry
}) {
  const variantIndex = (pokemon as PokemonListVariant).variantIndex ?? null
  const variantLabel = (pokemon as PokemonListVariant).variantType
    ? VARIANT_LABELS[(pokemon as PokemonListVariant).variantType]
    : null
  return (
    <div className="mb-1 sm:mb-4 flex items-start justify-between gap-3 pr-8 sm:pr-0">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <motion.h2
            className={`min-w-0 truncate pb-1 font-bold capitalize text-white ${pokemon.name.length > 14 ? 'text-lg xl:text-xl 2xl:text-2xl' : 'text-2xl xl:text-3xl 2xl:text-4xl'}`}
            layoutId={`name-${pokemon.name}-${id}`}
            transition={CARD_TRANSITION}
          >
            {pokemon.name}
          </motion.h2>
          {(pokemon.isLegendary || pokemon.isMythical) && (
            <motion.div
              layoutId={`star-${pokemon.name}-${id}`}
              transition={CARD_TRANSITION}
            >
              {pokemon.isMythical ? (
                <>
                  <TbSparkles className="text-pink-400 xl:hidden" size={22} />
                  <TbSparkles
                    className="text-pink-400 hidden xl:block 2xl:hidden"
                    size={26}
                  />
                  <TbSparkles
                    className="text-pink-400 hidden 2xl:block"
                    size={30}
                  />
                </>
              ) : (
                <>
                  <IoMdStar className="text-yellow-400 xl:hidden" size={22} />
                  <IoMdStar
                    className="text-yellow-400 hidden xl:block 2xl:hidden"
                    size={26}
                  />
                  <IoMdStar
                    className="text-yellow-400 hidden 2xl:block"
                    size={30}
                  />
                </>
              )}
            </motion.div>
          )}
        </div>
        <span className="-mt-1 sm:mt-0 block text-xs sm:text-sm xl:text-base tracking-widest font-mono font-semibold text-white/60">
          {formatPokedexId(pokemon.id, variantIndex)}
        </span>
      </div>
      <motion.div
        className="flex shrink-0 flex-wrap gap-1"
        layoutId={`types-${pokemon.name}-${id}`}
        transition={CARD_TRANSITION}
      >
        {pokemon.types.map(type => (
          <TypeBadge key={type} size="lg" type={type} />
        ))}
        {pokemon.isMythical && (
          <span className="rounded-full bg-pink-400 px-2 py-0.5 text-xs xl:text-sm 2xl:px-3 2xl:py-1 2xl:text-base font-medium text-black">
            Mythical
          </span>
        )}
        {pokemon.isLegendary && (
          <span className="rounded-full bg-yellow-400 px-2 py-0.5 text-xs xl:text-sm 2xl:px-3 2xl:py-1 2xl:text-base font-medium text-black">
            Legendary
          </span>
        )}
        {pokemon.isBaby && (
          <span className="rounded-full bg-blue-300/80 px-2 py-0.5 text-xs xl:text-sm 2xl:px-3 2xl:py-1 2xl:text-base font-medium text-black">
            Baby
          </span>
        )}
        {variantLabel && (
          <span className="rounded-full bg-white/25 px-2 py-0.5 text-xs xl:text-sm 2xl:px-3 2xl:py-1 2xl:text-base font-medium text-white">
            {variantLabel}
          </span>
        )}
      </motion.div>
    </div>
  )
}
