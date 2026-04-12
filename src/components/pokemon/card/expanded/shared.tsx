import { motion } from 'motion/react'
import { type ReactNode } from 'react'

export function InfoStat({
  label,
  muted,
  value
}: {
  label: string
  muted?: boolean
  value: ReactNode
}) {
  return (
    <div className="flex flex-col">
      <span className={muted ? 'text-white/50' : 'text-white/60'}>{label}</span>
      <span className="font-medium text-white">{value}</span>
    </div>
  )
}

export function TabPanelContent({
  children,
  className
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <motion.div
      animate={{ opacity: 1, x: 0 }}
      className={className}
      initial={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.15 }}
    >
      {children}
    </motion.div>
  )
}
