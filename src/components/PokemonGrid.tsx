'use client'

import { colors, getTypeColor } from '@/lib/pokemon'
import { Pokemon } from '@/types/pokemon'

import { Input } from './ui/input'

export default function PokemonGrid() {
  return (
    <div>
      <Input placeholder="Search" type="text" />
      <div>Pokemon Grid</div>
    </div>
  )
}
