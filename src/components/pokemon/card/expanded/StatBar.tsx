import { motion } from 'motion/react'

const STAT_MAX = 255

export function StatBar({ label, value }: { label: string; value: number }) {
  const rightClip = Math.round((1 - value / STAT_MAX) * 100)

  return (
    <div className="flex items-center gap-2 text-xs leading-tight sm:leading-normal sm:gap-3 sm:text-sm xl:gap-4 xl:text-base">
      <span className="w-14 shrink-0 text-white/70 sm:w-16 xl:w-24">{label}</span>
      <span className="w-6 shrink-0 text-right font-medium font-mono tabular-nums text-white sm:w-7 xl:w-9">{value}</span>
      <div className="h-2 flex-1 rounded-full bg-white/20 sm:h-2.5 xl:h-3">
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
