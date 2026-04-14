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
      className={`flex flex-col items-center gap-1 transition-opacity ${isCurrent ? 'opacity-100' : 'opacity-60'}`}
    >
      <Image
        alt={node.name}
        className="h-20 w-20 xl:h-24 xl:w-24 2xl:h-28 2xl:w-28 object-contain drop-shadow-md"
        height={80}
        src={spriteUrl}
        unoptimized
        width={80}
      />
      <span className="max-w-[80px] xl:max-w-[96px] truncate text-center text-xs xl:text-sm font-medium capitalize leading-tight text-white">
        {node.name}
      </span>
      <span className="text-[10px] xl:text-xs leading-none text-white/40">
        {formatPokedexId(node.id)}
      </span>
    </div>
  )
}

function TriggerConnector({ trigger }: { trigger: string }) {
  return (
    <div className="flex min-w-[52px] xl:min-w-[64px] flex-col items-center justify-center gap-1 px-2">
      <span className="line-clamp-2 max-w-[60px] xl:max-w-[72px] text-center text-[10px] xl:text-xs leading-tight text-white/40">
        {trigger}
      </span>
      <span className="text-xs xl:text-sm leading-none text-white/30">→</span>
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
    <TabPanelContent className="flex h-full w-full items-center justify-center">
      {!tree ? (
        <p className="text-xs italic text-white/30">Does not evolve</p>
      ) : (
        <div className="overflow-auto w-full flex items-center justify-center p-2">
          <div className="inline-flex items-center">
            <EvolutionNode currentId={pokemon.id} node={tree} />
          </div>
        </div>
      )}
    </TabPanelContent>
  )
}
