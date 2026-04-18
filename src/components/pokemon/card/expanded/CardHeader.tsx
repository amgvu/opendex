import { motion } from 'motion/react'
import { IoMdStar } from 'react-icons/io'
import { TbSparkles } from 'react-icons/tb'

import type { PokemonEntry, PokemonVariant } from '@/types/pokemon'

import { CARD_TRANSITION } from '@/lib/constants'
import { formatPokedexId, VARIANT_LABELS } from '@/lib/pokemon'

import { TypeBadge } from '../TypeBadge'

export function CardHeader({ fullModalOpen, id, pokemon }: { fullModalOpen: boolean; id: string; pokemon: PokemonEntry }) {
  const variantIndex = (pokemon as PokemonVariant).variantIndex ?? null
  const variantLabel = (pokemon as PokemonVariant).variantType
    ? VARIANT_LABELS[(pokemon as PokemonVariant).variantType]
    : null
  return (
    <div className="mb-1 sm:mb-4 flex items-start justify-between gap-3">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <motion.h2
            animate={{ opacity: fullModalOpen ? 0 : 1 }}
            className={`min-w-0 truncate pb-1 font-bold capitalize text-white ${pokemon.name.length > 14 ? 'text-lg xl:text-xl 2xl:text-2xl' : 'text-2xl xl:text-3xl 2xl:text-4xl'}`}
            layoutId={`name-${pokemon.name}-${id}`}
            transition={CARD_TRANSITION}
          >
            {pokemon.name}
          </motion.h2>
          {(pokemon.isLegendary || pokemon.isMythical) && (
            <motion.div
              animate={{ opacity: fullModalOpen ? 0 : 1 }}
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
        <span className="-mt-1 sm:mt-0 block text-sm xl:text-base 2xl:text-lg tracking-widest font-mono font-semibold text-white/60">
          {formatPokedexId(pokemon.id, variantIndex)}
        </span>
      </div>
      <motion.div
        animate={{ opacity: fullModalOpen ? 0 : 1 }}
        className="flex shrink-0 flex-wrap gap-1"
        layoutId={`types-${pokemon.name}-${id}`}
        transition={CARD_TRANSITION}
      >
        {pokemon.types.map(type => (
          <TypeBadge key={type} size="lg" type={type} />
        ))}
        {pokemon.isMythical && (
          <span className="rounded-full bg-pink-400 px-2 py-0.5 text-xs xl:px-3 xl:py-1 xl:text-sm 2xl:px-4 2xl:py-1.5 2xl:text-base font-medium text-black">
            Mythical
          </span>
        )}
        {pokemon.isLegendary && (
          <span className="rounded-full bg-yellow-400 px-2 py-0.5 text-xs xl:px-3 xl:py-1 xl:text-sm 2xl:px-4 2xl:py-1.5 2xl:text-base font-medium text-black">
            Legendary
          </span>
        )}
        {variantLabel && (
          <span className="rounded-full bg-white/25 px-2 py-0.5 text-xs xl:px-3 xl:py-1 xl:text-sm 2xl:px-4 2xl:py-1.5 2xl:text-base font-medium text-white">
            {variantLabel}
          </span>
        )}
      </motion.div>
    </div>
  )
}
