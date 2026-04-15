import type { LearnsetMove, MoveDetail, Pokemon } from '@/types/pokemon'

import { getTypeColor } from '@/lib/pokemon'

import { TabPanelContent } from './shared'

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

function formatMoveName(name: string) {
  return name
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

export function MoveTable({
  moves,
  showLevel
}: {
  moves: LearnsetMove[] | MoveDetail[]
  showLevel?: boolean
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-xs xl:text-sm 2xl:text-base">
        <thead>
          <tr className="text-left text-white/40">
            {showLevel && <th className="pb-1 pr-2 font-medium w-7">Lv</th>}
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
                  className={`inline-block rounded-full px-1.5 py-px text-[10px] xl:text-xs font-medium text-white ${getTypeColor(move.type)}`}
                >
                  {move.type}
                </span>
              </td>
              <td className="py-1 pr-2">
                <span
                  className={`inline-block rounded px-1 py-px text-[10px] xl:text-xs font-medium ${CATEGORY_STYLES[move.category] ?? CATEGORY_STYLES.status}`}
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

export function LearnsetPanel({ pokemon }: { pokemon: Pokemon }) {
  const { learnset } = pokemon

  if (!learnset) {
    return (
      <TabPanelContent>
        <p className="text-white/30 text-xs">Loading...</p>
      </TabPanelContent>
    )
  }

  return (
    <TabPanelContent className="flex flex-col gap-4">
      {learnset.levelUp.length > 0 && (
        <div>
          <p className="mb-1.5 text-[10px] xl:text-xs font-medium uppercase tracking-wider text-white/40">
            Level Up
          </p>
          <MoveTable moves={learnset.levelUp} showLevel />
        </div>
      )}

      {learnset.egg.length > 0 && (
        <div>
          <p className="mb-1.5 text-[10px] xl:text-xs font-medium uppercase tracking-wider text-white/40">
            Egg Moves
          </p>
          <MoveTable moves={learnset.egg} />
        </div>
      )}

      {learnset.machine.length > 0 && (
        <div>
          <p className="mb-1.5 text-[10px] xl:text-xs font-medium uppercase tracking-wider text-white/40">
            TM / Tutor
          </p>
          <MoveTable moves={learnset.machine} />
        </div>
      )}
    </TabPanelContent>
  )
}
