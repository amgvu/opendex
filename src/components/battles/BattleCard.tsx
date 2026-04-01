'use client'

import Image from 'next/image'
import type { BattleSummary } from '@/types/battle'
import { getPokemonById } from '@/lib/pokemon-lookup'
import { getTypeColor } from '@/lib/pokemon'

export function BattleCard({ battle }: { battle: BattleSummary }) {
  const p1 = getPokemonById(battle.pokemon1Id)
  const p2 = getPokemonById(battle.pokemon2Id)

  const p1Type = (p1?.types[0] ?? 'normal').toLowerCase()
  const p2Type = (p2?.types[0] ?? 'normal').toLowerCase()

  const p1Won = battle.winnerId === battle.pokemon1Id
  const p2Won = battle.winnerId === battle.pokemon2Id
  const completed = battle.status === 'completed'

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl"
      style={{ height: '140px' }}
    >
      {/* Left half — Pokemon 1 */}
      <div
        className={`absolute inset-y-0 left-0 flex items-center justify-start overflow-hidden ${getTypeColor(p1?.types[0] ?? '')}`}
        style={{
          width: '50%',
          clipPath: 'polygon(0 0, 100% 0, 88% 100%, 0 100%)'
        }}
      >
        <div className="absolute inset-0 bg-black/20" />
        {/* Type icon backdrop */}
        <Image
          alt=""
          aria-hidden
          className="absolute -left-4 top-1/2 -translate-y-1/2 opacity-15 grayscale"
          height={160}
          src={`/icons/${p1Type}.svg`}
          unoptimized
          width={160}
        />
        {/* Pokemon artwork */}
        {p1?.officialUrl && (
          <Image
            alt={battle.pokemon1Name}
            className="relative z-10 object-contain drop-shadow-lg transition-opacity duration-300"
            height={120}
            src={p1.officialUrl}
            style={{
              opacity: completed && !p1Won ? 0.6 : 1,
              marginLeft: '12px',
              width: 'auto',
              height: '110px'
            }}
            unoptimized
            width={120}
          />
        )}
        {/* Name */}
        <div className="absolute bottom-3 left-3 z-10">
          <p className="text-xs font-bold capitalize text-white drop-shadow">
            {battle.pokemon1Name}
          </p>
          {completed && p1Won && (
            <p className="text-[10px] text-yellow-300 font-semibold">Winner</p>
          )}
        </div>
      </div>

      {/* Right half — Pokemon 2 */}
      <div
        className={`absolute inset-y-0 right-0 flex items-center justify-end overflow-hidden ${getTypeColor(p2?.types[0] ?? '')}`}
        style={{
          width: '50%',
          clipPath: 'polygon(12% 0, 100% 0, 100% 100%, 0 100%)'
        }}
      >
        <div className="absolute inset-0 bg-black/20" />
        {/* Type icon backdrop */}
        <Image
          alt=""
          aria-hidden
          className="absolute -right-4 top-1/2 -translate-y-1/2 opacity-15 grayscale"
          height={160}
          src={`/icons/${p2Type}.svg`}
          unoptimized
          width={160}
        />
        {/* Pokemon artwork */}
        {p2?.officialUrl && (
          <Image
            alt={battle.pokemon2Name}
            className="relative z-10 object-contain drop-shadow-lg transition-opacity duration-300"
            height={120}
            src={p2.officialUrl}
            style={{
              opacity: completed && !p2Won ? 0.6 : 1,
              marginRight: '12px',
              width: 'auto',
              height: '110px'
            }}
            unoptimized
            width={120}
          />
        )}
        {/* Name */}
        <div className="absolute bottom-3 right-3 z-10 text-right">
          <p className="text-xs font-bold capitalize text-white drop-shadow">
            {battle.pokemon2Name}
          </p>
          {completed && p2Won && (
            <p className="text-[10px] text-yellow-300 font-semibold">Winner</p>
          )}
        </div>
      </div>

      {/* Center VS badge */}
      <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
        <span className="rounded-full bg-black/60 px-2 py-0.5 text-xs font-black text-white tracking-widest shadow">
          {battle.status === 'active'
            ? 'LIVE'
            : battle.status === 'queued'
              ? 'SOON'
              : 'VS'}
        </span>
      </div>
    </div>
  )
}
