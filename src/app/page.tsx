import { Suspense } from 'react'

import PokemonGrid from '@/components/pokemon/PokemonGrid'

export default function Home() {
  return (
    <main>
      <Suspense>
        <PokemonGrid />
      </Suspense>
    </main>
  )
}
