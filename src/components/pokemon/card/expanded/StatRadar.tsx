import { motion } from 'motion/react'
import { useMemo } from 'react'

import type { Pokemon } from '@/types/pokemon'

const CX = 100
const CY = 100
const R = 65
const STAT_MAX = 255

const AXES = [
  { angle: 270, key: 'hp' as keyof Pokemon, label: 'HP' },
  { angle: 330, key: 'attack' as keyof Pokemon, label: 'Atk' },
  { angle: 30, key: 'defense' as keyof Pokemon, label: 'Def' },
  { angle: 90, key: 'speed' as keyof Pokemon, label: 'Spd' },
  { angle: 150, key: 'specialDefense' as keyof Pokemon, label: 'SpD' },
  { angle: 210, key: 'specialAttack' as keyof Pokemon, label: 'SpA' }
]

function point(angle: number, r: number) {
  return {
    x: CX + r * Math.cos(toRad(angle)),
    y: CY + r * Math.sin(toRad(angle))
  }
}

function pointsStr(pts: { x: number; y: number }[]) {
  return pts.map(p => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' ')
}

function toRad(deg: number) {
  return (deg * Math.PI) / 180
}

const CENTER_STR = Array.from({ length: AXES.length }, () => `${CX},${CY}`).join(' ')

const RING_POINTS = [0.25, 0.5, 0.75, 1].map(f =>
  pointsStr(AXES.map(({ angle }) => point(angle, R * f)))
)

const AXIS_TIPS = AXES.map(({ angle }) => point(angle, R))

const LABEL_POS = AXES.map(({ angle }) => point(angle, R + 22))

export function StatRadar({ pokemon }: { pokemon: Pokemon }) {
  const statPointsStr = useMemo(
    () => pointsStr(AXES.map(({ angle, key }) => {
      const value = (pokemon[key] as number) ?? 0
      return point(angle, Math.sqrt(value / STAT_MAX) * R)
    })),
    [pokemon]
  )

  return (
    <svg
      className="w-full h-full"
      overflow="visible"
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
    >
      {RING_POINTS.map((pts, i) => (
        <polygon
          fill="none"
          key={i}
          points={pts}
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="1"
        />
      ))}

      {AXES.map(({ label }, i) => (
        <line
          key={label}
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="1"
          x1={CX}
          x2={AXIS_TIPS[i].x.toFixed(2)}
          y1={CY}
          y2={AXIS_TIPS[i].y.toFixed(2)}
        />
      ))}

      <motion.polygon
        animate={{ points: statPointsStr }}
        fill="rgba(255,255,255,0.18)"
        initial={{ points: CENTER_STR }}
        stroke="rgba(255,255,255,0.55)"
        strokeLinejoin="round"
        strokeWidth="1.5"
        transition={{ delay: 0.1, duration: 0.35, ease: 'easeOut' }}
      />

      {AXES.map(({ key, label }, i) => {
        const value = (pokemon[key] as number) ?? 0
        const pos = LABEL_POS[i]
        return (
          <g key={label}>
            <text
              dominantBaseline="auto"
              fill="rgba(255,255,255,0.45)"
              fontSize="12"
              fontWeight="600"
              textAnchor="middle"
              x={pos.x.toFixed(2)}
              y={(pos.y - 1).toFixed(2)}
            >
              {label}
            </text>
            <text
              dominantBaseline="hanging"
              fill="rgba(255,255,255,0.9)"
              fontSize="16"
              fontWeight="700"
              textAnchor="middle"
              x={pos.x.toFixed(2)}
              y={(pos.y + 2).toFixed(2)}
            >
              {value}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
