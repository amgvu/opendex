# Opendex — Pokemon Explorer

---

## What's Built

### Core Requirements

- **Search** — debounced input that filters by name, type, description, and Pokédex ID
- **Infinite scroll** — loads 20 Pokemon at a time, fetches the next page as the user approaches the bottom
- **Expandable cards** — default view shows name, type badges and thumbnails, expanded view shows full stats, description, full quality artwork, gif, height, weight, and generation
- **Responsive grid** — 2 columns on mobile up to 5 on desktop

### Beyond the Requirements

**Filtering and sorting**

- Filter by type (multi-select, intersection logic — selecting Fire + Flying finds dual-type Pokemon specifically)
- Filter by generation (1–9)
- Sort by any stat, name, or Pokédex ID in either direction
- All filters and sort state persist in the URL — shareable and bookmark-friendly

**Navigation**

- Keyboard navigation — arrow keys to move between cards, Escape to close
- Swipe to navigate on mobile — drag the expanded card left or right
- Auto-scroll keeps the selected card in view when navigating through the grid

**Polish**

- FLIP expansion animation — cards expand from their grid position into the overlay
- Animated stat bars and counters on card open
- GIF hover on the expanded card image (desktop) Tap to view (mobile)
- Dynamic page title updates to the selected Pokemon's name
- Custom blur placeholder on card images — each Pokemon has a precomputed blurDataURL that fills the image slot instantly, preventing empty flashes while artwork loads

---

## Technical Decisions

### TanStack Query — `usePokemonQuery`

Used `useInfiniteQuery` for paginated data fetching with page accumulation. `staleTime: Infinity` and `gcTime: Infinity` prevent unnecessary refetches on a static dataset. `keepPreviousData` keeps the current results visible while a new search or filter loads, avoiding blank flashes between queries. The `queryKey` includes all filter parameters so TanStack Query handles cache invalidation and page resets automatically.

### Virtualization — `useVirtualGrid`

Only the rows currently visible in the viewport are mounted in the DOM. For 1000 Pokemon across 200 rows, this keeps the mounted component count at ~60-80 at any time regardless of scroll position. Built with `@tanstack/react-virtual`'s `useWindowVirtualizer` for native window scroll performance.

### Memoization — `PokemonCard`

`React.memo` with a custom comparator that only re-renders a card when `active` or `pokemon` changes. Without this, every interaction in the parent would cascade into re-renders across all ~60 mounted cards simultaneously. The difference was immediately noticable with DevTools INP speeds of up to 200-300ms, reduced down to 48-64ms.

### API Design

The client fetch layer (`src/lib/api.ts`) and the server route handler (`src/app/api/pokemon/route.ts`) are kept separate. The server handles filtering, sorting, and pagination against the static dataset — the client only ever receives the 20 records it needs per page. The contract between them means switching from the static JSON to a real database would require changes only in `route.ts`.

---

## Stack

- **Next.js 15** App Router
- **TypeScript**
- **Tailwind CSS** + **shadcn/ui**
- **TanStack Query** — data fetching and caching
- **TanStack Virtual** — windowed list virtualization
- **Framer Motion** — layout animations
- **plaiceholder + sharp** — used for generating the blur placeholders at data-generation time

---

## Running Locally

```bash
pnpm install
pnpm dev
```

Scripts are available to regenerate both faker.js and real PokeAPI/Showdown data.

---
