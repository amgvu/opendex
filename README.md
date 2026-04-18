# Opendex

A Pokémon explorer built with Next.js. Browse all 1,025 Pokémon with infinite scroll, search, filtering, and richly detailed expandable cards.

## Features

**Browsing & Search**
- Infinite-scrolling grid with 20 Pokémon per page, auto-loads on scroll
- Real-time search (debounced) across name, Pokédex ID, type names, and Pokédex descriptions
- Multi-select type filtering with intersection logic (Fire + Flying → only dual-type Fire/Flying)
- Generation filtering (Gen 1–9)
- Sort by ID, Name, Generation, or any base stat (HP, Atk, Def, Sp.Atk, Sp.Def, Spd, BST)
- All filter/sort/selection state persists in the URL for sharing and bookmarking

**Card Views**
- **Grid card** — type-colored background, official artwork, type badges, legendary/mythical indicators
- **Expanded card** — modal with tabbed detail panels: Stats, Battle, Bio, Moves, Evolution
- **Full modal** — maximized two-pane layout with larger artwork and the same panels at full scale

**Detail Panels**
- *Stats:* Stat bars or radar chart (toggleable), height, weight, generation, growth rate, base experience
- *Battle:* Type effectiveness (weaknesses, resistances, immunities with multipliers), catch rate, EV yield, abilities with descriptions
- *Bio:* Pokédex genus, flavor text by game version, habitat, color, egg groups, held items
- *Moves:* Level-up, Egg, and TM/Tutor moves in sortable tables with type, category, power, accuracy, PP
- *Evolution:* Visual evolution tree with triggers and branching paths

**Artwork Controls**
- Animated GIF toggle (3D Pokémon Showdown sprites)
- Shiny variant toggle
- Copy-link button (copies the current URL with Pokémon selected)

**Navigation**
- Arrow keys to navigate between Pokémon, Escape to close
- Swipe/drag on mobile to navigate left/right
- Auto-scrolls to keep the selected card in view
- Direct URL access (`?pokemon=bulbasaur`) works even for off-screen Pokémon

## Stack

| Layer | Library |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| Components | shadcn/ui (Radix), HeroUI |
| Animation | Motion (Framer Motion) 12 |
| State | Zustand 5 |
| Server state | TanStack React Query 5 |
| Virtualization | TanStack Virtual 3 |
| Icons | Lucide React, React Icons |
| Analytics | Vercel Analytics, Speed Insights |
| Fonts | IBM Plex Sans, IBM Plex Mono |

## Architecture

**Data flow** — The full dataset lives in `src/data/pokemon.json`. The server route (`/api/pokemon`) handles all filtering, sorting, and pagination; clients only receive the 20 records per page they need. Swapping to a database requires changes only in `route.ts`.

**State layers**
- `useFilterStore` (Zustand) — search, sort, types, generations; toggle and sort logic lives inside the store
- `useSelectionStore` (Zustand) — selected Pokémon and a `fromUrl` flag
- TanStack Query — fetched data with `staleTime: Infinity` / `gcTime: Infinity` (static data, never refetches); queryKey includes all filter params so page resets happen automatically
- `CardContext` — per-card UI toggles (active tab, GIF, shiny, full modal open); mounted in `QueryProvider` to survive filter-driven re-renders
- `NavigationContext` — onNext/onPrev callbacks scoped to the grid

**URL sync** — Four hooks in `src/hooks/filters/` bridge Zustand stores to URL search params. They initialize store state synchronously on first render (via a `useRef` guard) to avoid double-fetching on page load with params.

**Virtualization** — `useVirtualGrid` uses `useWindowVirtualizer` on the window scroll, maps the flat Pokémon array into responsive grid rows (2–6 columns), triggers `loadMore` near the last row, and preloads upcoming images.

**Memoization** — `PokemonCard` is wrapped in `React.memo` with a custom comparator (`active` and `pokemon` props only). With 50–80 cards mounted simultaneously, this prevents cascading re-renders on any interaction.

**FLIP animations** — Shared `layoutId` between `DefaultCard` and `ExpandedCard` lets Motion animate the card's position, size, and content between grid and modal. The backdrop and portal to `document.body` escape the grid's stacking context.

**Prefetch on hover** — `DefaultCard` calls `queryClient.prefetchQuery` on hover, so detail data is ready before the card opens.

**Blur placeholders** — Each Pokémon has a precomputed `blurDataURL` generated at build time via `plaiceholder`, eliminating layout shift while artwork loads.

**Drag navigation** — `ExpandedCard` uses Motion's `drag="x"` with `dragElastic={0.1}`; `onDragEnd` checks offset (>50px triggers navigation) to prevent accidental swipes.

## Commands

```bash
pnpm dev        # Start dev server with Turbopack
pnpm build      # Production build
pnpm lint       # Run ESLint (quiet mode)
pnpm lint:fix   # Auto-fix ESLint issues
```
