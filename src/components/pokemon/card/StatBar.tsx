import { animate, motion, useMotionValue, useTransform } from 'motion/react'
import { useEffect } from 'react'

const STAT_MAX = 255

export function StatBar({ label, value }: { label: string; value: number }) {
  const pct = Math.round((value / STAT_MAX) * 100)
  const count = useMotionValue(0)
  const rounded = useTransform(count, v => Math.round(v))

  useEffect(() => {
    const controls = animate(count, value, {
      delay: 0.15,
      duration: 0.3,
      ease: 'easeOut'
    })
    return controls.stop
  }, [count, value])

  return (
    <div className="flex items-center gap-3 text-sm xl:text-base">
      <span className="w-20 xl:w-24 shrink-0 text-white/70">{label}</span>
      <motion.span className="w-8 shrink-0 text-right font-medium text-white">
        {rounded}
      </motion.span>
      <div className="h-3 flex-1 overflow-hidden rounded-full bg-white/20">
        <motion.div
          animate={{ width: `${pct}%` }}
          className="h-full rounded-full bg-white/70"
          initial={{ width: '0%' }}
          transition={{ delay: 0.15, duration: 0.3, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}
