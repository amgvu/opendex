import { motion } from 'motion/react'

const STAT_MAX = 255

export function StatBar({ label, value }: { label: string; value: number }) {
  const rightClip = Math.round((1 - value / STAT_MAX) * 100)

  return (
    <div className="flex items-center gap-3 text-xs sm:text-sm xl:text-base 2xl:text-lg">
      <span className="w-16 sm:w-20 xl:w-24 2xl:w-28 shrink-0 text-white/70">{label}</span>
      <span className="w-7 sm:w-8 shrink-0 text-right font-medium text-white">{value}</span>
      <div className="h-2 sm:h-3 2xl:h-3.5 flex-1 rounded-full bg-white/20">
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
