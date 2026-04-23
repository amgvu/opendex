import { motion } from 'motion/react'
import { type ReactNode } from 'react'

export const PANEL_BODY_TEXT = 'text-xs sm:text-sm xl:text-base'
export const PANEL_META_LABEL =
  'text-[10px] sm:text-xs xl:text-sm font-medium uppercase tracking-wider text-white/40'
export const PANEL_SECTION_LABEL = `${PANEL_BODY_TEXT} text-white/60`
export const PANEL_CHIP_TEXT = 'text-xs sm:text-sm xl:text-base'
export const PANEL_BADGE_TEXT = 'text-[10px] sm:text-xs xl:text-sm'

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

export function MetaLabel({ children }: { children: ReactNode }) {
  return <p className={PANEL_META_LABEL}>{children}</p>
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return <span className={PANEL_SECTION_LABEL}>{children}</span>
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
      className={`pb-[calc(env(safe-area-inset-bottom)+2rem)] sm:pb-[env(safe-area-inset-bottom)] ${className ?? ''}`}
      initial={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.15 }}
    >
      {children}
    </motion.div>
  )
}
