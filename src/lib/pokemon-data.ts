import 'server-only'
import fs from 'fs'
import path from 'path'

import type { PokemonEntry, PokemonListEntry } from '@/lib/types'

let _data: null | PokemonEntry[] = null
let _byName: Map<string, PokemonEntry> | null = null
let _listData: null | PokemonListEntry[] = null

export function getPokemonByName(): Map<string, PokemonEntry> {
  if (_byName) return _byName
  _byName = new Map(getPokemonData().map(p => [p.name, p]))
  return _byName
}

export function getPokemonData(): PokemonEntry[] {
  if (_data) return _data
  const filePath = path.join(process.cwd(), 'src/data/pokemon.json')
  _data = JSON.parse(fs.readFileSync(filePath, 'utf-8')) as PokemonEntry[]
  return _data
}

export function getPokemonListData(): PokemonListEntry[] {
  if (_listData) return _listData
  const filePath = path.join(process.cwd(), 'src/data/pokemon-list.json')
  _listData = JSON.parse(fs.readFileSync(filePath, 'utf-8')) as PokemonListEntry[]
  return _listData
}
