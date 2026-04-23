import Image from 'next/image'

import type { EvolutionStep, Pokemon } from '@/types/pokemon'

import { formatPokedexId } from '@/lib/pokemon'

import { TabPanelContent } from './shared'

type TreeNode = {
  children: { node: TreeNode; trigger: string }[]
  id: number
  name: string
}

export function EvolutionPanel({
  large,
  pokemon
}: {
  large?: boolean
  pokemon: Pokemon
}) {
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
    <TabPanelContent className="flex flex-col w-full items-center justify-center">
      {!tree ? (
        <p className="text-xs italic text-white/30">Does not evolve</p>
      ) : (
        <EvolutionNode currentId={pokemon.id} large={large} node={tree} />
      )}
    </TabPanelContent>
  )
}

function buildTree(steps: EvolutionStep[]): null | TreeNode {
  if (!steps.length) return null

  const childrenOf = new Map<
    number,
    { toId: number; toName: string; trigger: string }[]
  >()
  const allToIds = new Set<number>()

  for (const s of steps) {
    if (!childrenOf.has(s.fromId)) childrenOf.set(s.fromId, [])
    childrenOf
      .get(s.fromId)!
      .push({ toId: s.toId, toName: s.toName, trigger: s.trigger })
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

function EvolutionNode({
  currentId,
  large,
  node
}: {
  currentId: number
  large?: boolean
  node: TreeNode
}) {
  return (
    <div className="flex items-center">
      <PokemonNode currentId={currentId} large={large} node={node} />
      {node.children.length > 0 && (
        <div className="flex flex-col justify-center">
          {node.children.map(({ node: child, trigger }) => (
            <div className="flex items-center" key={child.id}>
              <TriggerConnector large={large} trigger={trigger} />
              <EvolutionNode currentId={currentId} large={large} node={child} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function PokemonNode({
  currentId,
  large,
  node
}: {
  currentId: number
  large?: boolean
  node: TreeNode
}) {
  const isCurrent = node.id === currentId
  const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${node.id}.png`

  return (
    <div
      className={`flex flex-col items-center gap-1 transition-opacity ${isCurrent ? 'opacity-100' : 'opacity-60'}`}
    >
      <Image
        alt={node.name}
        className={`object-contain drop-shadow-md ${large ? 'h-44 w-44 xl:h-52 xl:w-52 2xl:h-60 2xl:w-60' : 'h-20 w-20 xl:h-24 xl:w-24 2xl:h-28 2xl:w-28'}`}
        height={large ? 240 : 80}
        src={spriteUrl}
        unoptimized
        width={large ? 160 : 80}
      />
      <span
        className={`truncate text-center font-medium capitalize leading-tight text-white ${large ? 'max-w-[120px] text-sm xl:text-base' : 'max-w-[80px] xl:max-w-[96px] text-xs xl:text-sm'}`}
      >
        {node.name}
      </span>
      <span
        className={`leading-none text-white/40 ${large ? 'text-xs xl:text-sm' : 'text-[10px] xl:text-xs'}`}
      >
        {formatPokedexId(node.id)}
      </span>
    </div>
  )
}

function TriggerConnector({
  large,
  trigger
}: {
  large?: boolean
  trigger: string
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-1 px-3 ${large ? 'min-w-[100px]' : 'min-w-[52px] xl:min-w-[64px]'}`}
    >
      <span
        className={`line-clamp-2 text-center leading-tight text-white/40 ${large ? 'max-w-[96px] text-xs xl:text-sm' : 'max-w-[60px] xl:max-w-[72px] text-[10px] xl:text-xs'}`}
      >
        {trigger}
      </span>
      <span
        className={`leading-none text-white/30 ${large ? 'text-base xl:text-lg' : 'text-xs xl:text-sm'}`}
      >
        →
      </span>
    </div>
  )
}
