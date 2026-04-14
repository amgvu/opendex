import Image from 'next/image'

import type { EvolutionStep, Pokemon } from '@/types/pokemon'

import { formatPokedexId } from '@/lib/pokemon'

import { TabPanelContent } from './shared'

type TreeNode = {
  children: { node: TreeNode; trigger: string }[]
  id: number
  name: string
}

function buildTree(steps: EvolutionStep[]): TreeNode | null {
  if (!steps.length) return null

  const childrenOf = new Map<number, { toId: number; toName: string; trigger: string }[]>()
  const allToIds = new Set<number>()

  for (const s of steps) {
    if (!childrenOf.has(s.fromId)) childrenOf.set(s.fromId, [])
    childrenOf.get(s.fromId)!.push({ toId: s.toId, toName: s.toName, trigger: s.trigger })
    allToIds.add(s.toId)
  }

  const root = steps.find(s => !allToIds.has(s.fromId))
  if (!root) return null

  function build(id: number, name: string): TreeNode {
    return {
      children: (childrenOf.get(id) ?? []).map(e => ({
        node: build(e.toId, e.toName),
        trigger: e.trigger
      })),
      id,
      name
    }
  }

  return build(root.fromId, root.fromName)
}

function PokemonNode({ currentId, node }: { currentId: number; node: TreeNode }) {
  const isCurrent = node.id === currentId
  const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${node.id}.png`

  return (
    <div
      className={`flex flex-col items-center gap-0.5 transition-opacity ${isCurrent ? 'opacity-100' : 'opacity-60'}`}
    >
      <Image
        alt={node.name}
        className="h-14 w-14 object-contain drop-shadow-sm"
        height={56}
        src={spriteUrl}
        unoptimized
        width={56}
      />
      <span className="max-w-[56px] truncate text-center text-[10px] font-medium capitalize leading-tight text-white">
        {node.name}
      </span>
      <span className="text-[9px] leading-none text-white/40">
        {formatPokedexId(node.id)}
      </span>
    </div>
  )
}

function TriggerConnector({ trigger }: { trigger: string }) {
  return (
    <div className="flex min-w-[44px] flex-col items-center justify-center gap-0.5 px-1.5">
      <span className="line-clamp-2 max-w-[52px] text-center text-[9px] leading-tight text-white/40">
        {trigger}
      </span>
      <span className="text-[10px] leading-none text-white/30">→</span>
    </div>
  )
}

function EvolutionNode({ currentId, node }: { currentId: number; node: TreeNode }) {
  return (
    <div className="flex items-center">
      <PokemonNode currentId={currentId} node={node} />
      {node.children.length > 0 && (
        <div className="flex flex-col justify-center">
          {node.children.map(({ node: child, trigger }) => (
            <div className="flex items-center" key={child.id}>
              <TriggerConnector trigger={trigger} />
              <EvolutionNode currentId={currentId} node={child} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function EvolutionPanel({ pokemon }: { pokemon: Pokemon }) {
  const chain = pokemon.evolutionChain

  if (chain === undefined) {
    return (
      <TabPanelContent>
        <p className="text-xs text-white/30">Loading...</p>
      </TabPanelContent>
    )
  }

  const tree = buildTree(chain)

  return (
    <TabPanelContent className="flex flex-col gap-2">
      {!tree ? (
        <p className="text-xs italic text-white/30">Does not evolve</p>
      ) : (
        <div className="overflow-x-auto pb-1">
          <div className="inline-flex items-start min-w-min">
            <EvolutionNode currentId={pokemon.id} node={tree} />
          </div>
        </div>
      )}
    </TabPanelContent>
  )
}
