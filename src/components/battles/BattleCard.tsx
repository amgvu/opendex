/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
'use client'

import Image from 'next/image'

import type { BattleSummary } from '@/types/battle'

import { getTypeColor } from '@/lib/pokemon'
import { getPokemonById } from '@/lib/pokemon-lookup'

export function BattleCard({
  battle,
  onClick
}: {
  battle: BattleSummary
  onClick?: () => void
}) {
  const p1 = getPokemonById(battle.pokemon1Id)
  const p2 = getPokemonById(battle.pokemon2Id)

  const p1Type = (p1?.types[0] ?? 'normal').toLowerCase()
  const p2Type = (p2?.types[0] ?? 'normal').toLowerCase()

  const p1Won = battle.winnerId === battle.pokemon1Id
  const p2Won = battle.winnerId === battle.pokemon2Id
  const completed = battle.status === 'completed'

  return (
    <button
      className="relative w-full overflow-hidden rounded-xl cursor-pointer hover:brightness-110 transition-[filter]"
      onClick={onClick}
      style={{ height: '80px' }}
    >
      {/* Left half — Pokemon 1 */}
      <div
        className={`absolute inset-y-0 left-0 flex items-center justify-start overflow-hidden ${getTypeColor(p1?.types[0] ?? '')}`}
        style={{
          clipPath: 'polygon(0 0, 100% 0, 88% 100%, 0 100%)',
          width: '50%'
        }}
      >
        <div className="absolute inset-0 bg-black/20" />
        <Image
          alt=""
          aria-hidden
          className="absolute -left-2 top-1/2 -translate-y-1/2 opacity-15 grayscale"
          height={256}
          src={`/icons/${p1Type}.svg`}
          unoptimized
          width={256}
        />
        {p1?.officialUrl && (
          <Image
            alt={battle.pokemon1Name}
            className="relative z-10 object-contain drop-shadow-lg transition-opacity duration-300"
            height={60}
            src={p1.officialUrl}
            style={{
              height: '182px',
              marginLeft: '42px',
              marginTop: '16px',
              opacity: completed && !p2Won ? 0.3 : 1,
              width: 'auto'
            }}
            unoptimized
            width={60}
          />
        )}
        <div className="absolute bottom-1.5 left-2 z-10">
          <p className="text-[10px] font-bold capitalize text-white drop-shadow leading-tight">
            {battle.pokemon1Name}
          </p>
          {completed && p1Won && (
            <p className="text-[9px] text-yellow-300 font-semibold leading-tight">
              Winner
            </p>
          )}
        </div>
      </div>

      {/* Right half — Pokemon 2 */}
      <div
        className={`absolute inset-y-0 right-0 flex items-center justify-end overflow-hidden ${getTypeColor(p2?.types[0] ?? '')}`}
        style={{
          clipPath: 'polygon(12% 0, 100% 0, 100% 100%, 0 100%)',
          width: '50%'
        }}
      >
        <div className="absolute inset-0 bg-black/20" />
        <Image
          alt=""
          aria-hidden
          className="absolute -right-2 top-1/2 -translate-y-1/2 opacity-15 grayscale"
          height={256}
          src={`/icons/${p2Type}.svg`}
          unoptimized
          width={256}
        />
        {p2?.officialUrl && (
          <Image
            alt={battle.pokemon2Name}
            className="relative z-10 object-contain drop-shadow-lg transition-opacity duration-300"
            height={60}
            src={p2.officialUrl}
            style={{
              height: '182px',
              marginRight: '42px',
              marginTop: '16px',
              opacity: completed && !p2Won ? 0.3 : 1,
              width: 'auto'
            }}
            unoptimized
            width={60}
          />
        )}
        <div className="absolute bottom-1.5 right-2 z-10 text-right">
          <p className="text-[10px] font-bold capitalize text-white drop-shadow leading-tight">
            {battle.pokemon2Name}
          </p>
          {completed && p2Won && (
            <p className="text-[9px] text-yellow-300 font-semibold leading-tight">
              Winner
            </p>
          )}
        </div>
      </div>

      {/* Center badge */}
      <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
        <span className="rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-black text-white tracking-widest shadow">
          {battle.status === 'active'
            ? 'LIVE'
            : battle.status === 'queued'
              ? 'SOON'
              : 'VS'}
        </span>
      </div>
    </button>
  )
}
