import { motion } from 'motion/react'

const STAT_MAX = 255

export function StatBar({ label, value }: { label: string; value: number }) {
  const rightClip = Math.round((1 - value / STAT_MAX) * 100)

  return (
    <div className="flex items-center gap-3 text-xs sm:text-sm xl:gap-4 xl:text-lg 2xl:text-xl">
      <span className="w-16 shrink-0 text-white/70 sm:w-20 xl:w-28 2xl:w-32">{label}</span>
      <span className="w-7 shrink-0 text-right font-medium text-white sm:w-8 xl:w-10">{value}</span>
      <div className="h-2 flex-1 rounded-full bg-white/20 sm:h-3 xl:h-3.5 2xl:h-4">
        <motion.div
          animate={{ clipPath: `inset(0 ${rightClip}% 0 0 round 9999px)` }}
          className="h-full w-full rounded-full bg-white/70"
          initial={{ clipPath: 'inset(0 100% 0 0 round 9999px)' }}
          transition={{ delay: 0.15, duration: 0.3, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}
