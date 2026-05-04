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
- **Expanded card** — modal with tabbed detail panels: Stats, Bio, Moves, Evol
- Two animation modes: FLIP expansion from the grid card, or slide transition when navigating between Pokémon

**Detail Panels**
- *Stats:* Stat bars + radar chart (side by side), height, weight, gen, growth rate, base exp, friendship, catch rate, EV yield, abilities (expandable long-effect descriptions), type effectiveness (weaknesses, resistances, immunities with multipliers)
- *Bio:* Pokédex genus and flavor texts by game version, habitat, color, gender rate, egg groups, egg cycles, shape, wild held items, encounter locations
- *Moves:* Level-up, Egg, and TM/Tutor moves in sortable tables with type, category, power, accuracy, PP
- *Evol:* Visual evolution tree with triggers and branching paths

**Artwork Controls**
- Animated GIF toggle (3D Pokémon Showdown sprites)
- Shiny variant toggle
- Gigantamax toggle (for eligible Pokémon)
- Swipe up/down on artwork to collapse and reclaim panel space
- Copy-link button (copies the current URL with Pokémon selected)

**Navigation**
- Drag left/right or use arrow keys to navigate between Pokémon, Escape to close
- Swipe left/right on tab content to switch tabs
- Auto-scrolls the grid to keep the selected card in view
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

**Data flow** — The list dataset lives in `src/data/pokemon.json`. The list route (`/api/pokemon`) handles filtering, sorting, and pagination; clients receive 20 records per page. Detail data is fetched lazily per Pokémon via `/api/pokemon/[name]` when a card is expanded, and cached indefinitely. Swapping to a database requires changes only in the route files.

**State layers**
- `useFilterStore` (Zustand) — search, sort, types, generations; toggle and sort logic lives inside the store
- `useSelectionStore` (Zustand) — selected Pokémon name, a `fromUrl` flag, animation `mode` ('flip' | 'slide'), and `slideDirection`
- `useCardStore` (Zustand) — per-session card UI state: active tab, GIF/shiny/Gigantamax enabled, artwork collapsed; global store so state survives filter-driven re-renders
- TanStack Query — fetched data with `staleTime: Infinity` / `gcTime: Infinity` (static data, never refetches); queryKey includes all filter params so page resets happen automatically
- `NavigationContext` — onNext/onPrev callbacks scoped to the grid

**URL sync** — Four hooks in `src/hooks/filters/` bridge Zustand stores to URL search params. They initialize store state synchronously on first render (via a `useRef` guard) to avoid double-fetching on page load with params.

**Virtualization** — `useVirtualGrid` uses `useWindowVirtualizer` on the window scroll, maps the flat Pokémon array into responsive grid rows (2–6 columns), triggers `loadMore` near the last row, and preloads upcoming images.

**Card animation modes** — When clicking a grid card, a FLIP animation (`layoutId`) expands it in place. When navigating with arrows, drag, or from a URL param, `SlideCard` renders the expanded card in a slide transition instead, avoiding mismatched FLIP origins.

**Memoization** — `PokemonCard` is wrapped in `React.memo` with a custom comparator (`active` and `pokemon` props only). With 50–80 cards mounted simultaneously, this prevents cascading re-renders on any interaction.

**Prefetch on hover** — `DefaultCard` calls `queryClient.prefetchQuery` on hover, so detail data is ready before the card opens.

**Blur placeholders** — Each Pokémon has a precomputed `blurDataURL` generated at build time via `plaiceholder`, eliminating layout shift while artwork loads.

**Mobile toolbar** — Filter and sort controls live in a bottom `Drawer` (vaul) on mobile, and as static inline controls on desktop (≥xl).

## Commands

```bash
pnpm dev        # Start dev server with Turbopack
pnpm build      # Download artwork, generate data, then production build
pnpm lint       # Run ESLint (quiet mode)
pnpm lint:fix   # Auto-fix ESLint issues
pnpm test       # Run Jest unit tests
```

Data regeneration scripts live in `scripts/` and run with `node scripts/<file>`.
