import type { Pokemon } from '@/types/pokemon'

import { MoveTable } from '../expanded/LearnsetPanel'
import { TabPanelContent } from '../expanded/shared'

export function FullMovesPanel({ pokemon }: { pokemon: Pokemon }) {
  const { learnset } = pokemon

  if (!learnset) {
    return (
      <TabPanelContent>
        <p className="text-white/30 text-xs">Loading...</p>
      </TabPanelContent>
    )
  }

  return (
    <TabPanelContent className="flex gap-8">
      {/* LEFT: level-up moves */}
      <div className="flex-1 min-w-0">
        {learnset.levelUp.length > 0 && (
          <div>
            <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-white/40">
              Level Up
            </p>
            <MoveTable moves={learnset.levelUp} showLevel />
          </div>
        )}
      </div>

      {/* RIGHT: egg + TM/tutor */}
      <div className="flex-1 min-w-0 flex flex-col gap-6">
        {learnset.egg.length > 0 && (
          <div>
            <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-white/40">
              Egg Moves
            </p>
            <MoveTable moves={learnset.egg} />
          </div>
        )}
        {learnset.machine.length > 0 && (
          <div>
            <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-white/40">
              TM / Tutor
            </p>
            <MoveTable moves={learnset.machine} />
          </div>
        )}
      </div>
    </TabPanelContent>
  )
}
