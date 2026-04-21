import type { LearnsetMove, MoveDetail, Pokemon } from '@/types/pokemon'

import { getTypeColor } from '@/lib/pokemon'
import { useEffect, useMemo, useRef, useState } from 'react'
import { TbSearch } from 'react-icons/tb'

import {
  MetaLabel,
  PANEL_BADGE_TEXT,
  PANEL_BODY_TEXT,
  TabPanelContent
} from './shared'

const CATEGORY_STYLES: Record<string, string> = {
  physical: 'bg-orange-500/30 text-orange-300',
  special: 'bg-indigo-500/30 text-indigo-300',
  status: 'bg-white/10 text-white/40'
}

const CATEGORY_LABELS: Record<string, string> = {
  physical: 'Phys',
  special: 'Spec',
  status: 'Stat'
}

type CategoryFilter = 'all' | 'physical' | 'special' | 'status'

const CATEGORY_CHIPS: { label: string; value: CategoryFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Phys', value: 'physical' },
  { label: 'Spec', value: 'special' },
  { label: 'Stat', value: 'status' }
]

export function LearnsetPanel({ pokemon }: { pokemon: Pokemon }) {
  const { learnset } = pokemon
  const [query, setQuery] = useState('')
  const [catFilter, setCatFilter] = useState<CategoryFilter>('all')
  const [filterBarHeight, setFilterBarHeight] = useState(0)
  const filterBarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = filterBarRef.current
    if (!el) return
    const ro = new ResizeObserver(() => setFilterBarHeight(el.offsetHeight))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const filtered = useMemo(() => {
    if (!learnset) return null
    const q = query.toLowerCase()
    const match = (move: MoveDetail) => {
      if (catFilter !== 'all' && move.category !== catFilter) return false
      if (q && !move.name.includes(q)) return false
      return true
    }
    return {
      egg: learnset.egg.filter(match),
      levelUp: learnset.levelUp.filter(match),
      machine: learnset.machine.filter(match)
    }
  }, [learnset, query, catFilter])

  const allEmpty =
    filtered !== null &&
    filtered.levelUp.length === 0 &&
    filtered.egg.length === 0 &&
    filtered.machine.length === 0

  if (!learnset) {
    return (
      <TabPanelContent>
        <p className="text-white/30 text-xs">Loading...</p>
      </TabPanelContent>
    )
  }

  return (
    <TabPanelContent className="flex flex-col">
      <div
        className="sticky top-0 z-20 -mx-0 bg-black/70 backdrop-blur-sm pb-2 pt-1"
        data-no-drag
        ref={filterBarRef}
      >
        <div className="relative mb-1.5">
          <TbSearch
            className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-white/30"
            size={13}
          />
          <input
            className="w-full rounded-md bg-white/10 py-1 pl-7 pr-2 text-xs text-white placeholder:text-white/30 outline-none focus:bg-white/15 transition-colors"
            onChange={e => setQuery(e.target.value)}
            placeholder="Search moves…"
            type="text"
            value={query}
          />
        </div>
        <div className="flex gap-1">
          {CATEGORY_CHIPS.map(chip => (
            <button
              className={`rounded px-2 py-0.5 font-medium transition-colors cursor-pointer ${PANEL_BADGE_TEXT} ${
                catFilter === chip.value
                  ? chip.value === 'all'
                    ? 'bg-white/20 text-white'
                    : `${CATEGORY_STYLES[chip.value] ?? ''} ring-1 ring-inset ring-white/20`
                  : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/60'
              }`}
              key={chip.value}
              onClick={() => setCatFilter(chip.value)}
              type="button"
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {allEmpty ? (
        <p className="py-6 text-center text-white/30 text-xs">No moves match</p>
      ) : (
        <div className="flex flex-col gap-4 pt-2">
          {filtered!.levelUp.length > 0 && (
            <div>
              <div className="mb-1.5">
                <MetaLabel>Level Up</MetaLabel>
              </div>
              <MoveTable moves={filtered!.levelUp} showLevel stickyTop={filterBarHeight} />
            </div>
          )}

          {filtered!.egg.length > 0 && (
            <div>
              <div className="mb-1.5">
                <MetaLabel>Egg Moves</MetaLabel>
              </div>
              <MoveTable moves={filtered!.egg} stickyTop={filterBarHeight} />
            </div>
          )}

          {filtered!.machine.length > 0 && (
            <div>
              <div className="mb-1.5">
                <MetaLabel>TM / Tutor</MetaLabel>
              </div>
              <MoveTable moves={filtered!.machine} stickyTop={filterBarHeight} />
            </div>
          )}
        </div>
      )}
    </TabPanelContent>
  )
}

export function MoveTable({
  moves,
  showLevel,
  stickyTop = 0
}: {
  moves: LearnsetMove[] | MoveDetail[]
  showLevel?: boolean
  stickyTop?: number
}) {
  return (
    <div className="overflow-x-auto">
      <table className={`w-full border-collapse ${PANEL_BODY_TEXT}`}>
        <thead
          className="z-10 bg-black/70 backdrop-blur-sm"
          style={{ position: 'sticky', top: stickyTop }}
        >
          <tr className="text-left text-white/40">
            {showLevel && <th className={`w-7 pb-1 pr-2 font-medium ${PANEL_BADGE_TEXT}`}>Lv</th>}
            <th className="pb-1 pr-2 font-medium">Move</th>
            <th className="pb-1 pr-2 font-medium">Type</th>
            <th className="pb-1 pr-2 font-medium">Cat</th>
            <th className="pb-1 pr-1 font-medium text-right">Pwr</th>
            <th className="pb-1 pr-1 font-medium text-right">Acc</th>
            <th className="pb-1 font-medium text-right">PP</th>
          </tr>
        </thead>
        <tbody>
          {moves.map(move => (
            <tr
              className="border-t border-white/5 hover:bg-white/5 transition-colors"
              key={move.name}
            >
              {showLevel && (
                <td className="py-1 pr-2 tabular-nums text-white/40">
                  {(move as LearnsetMove).level}
                </td>
              )}
              <td className="py-1 pr-2 font-medium text-white whitespace-nowrap">
                {formatMoveName(move.name)}
              </td>
              <td className="py-1 pr-2">
                <span
                  className={`inline-block rounded-full px-1.5 py-px font-medium text-white ${getTypeColor(move.type)} ${PANEL_BADGE_TEXT}`}
                >
                  {move.type}
                </span>
              </td>
              <td className="py-1 pr-2">
                <span
                  className={`inline-block rounded px-1 py-px font-medium ${CATEGORY_STYLES[move.category] ?? CATEGORY_STYLES.status} ${PANEL_BADGE_TEXT}`}
                >
                  {CATEGORY_LABELS[move.category] ?? move.category}
                </span>
              </td>
              <td className="py-1 pr-1 text-right tabular-nums text-white/80">
                {move.power ?? '—'}
              </td>
              <td className="py-1 pr-1 text-right tabular-nums text-white/80">
                {move.accuracy ?? '—'}
              </td>
              <td className="py-1 text-right tabular-nums text-white/50">
                {move.pp}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function formatMoveName(name: string) {
  return name
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}
