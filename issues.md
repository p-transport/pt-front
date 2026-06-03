# Outstanding issues

Tracker for known issues from the 2026-04-28 architect review and follow-up cleanup. Items marked done in this session have been removed; what's below is what's still pending.

Severity: **high** = correctness/UX bug; **medium** = real friction or risk; **low** = cosmetic / cleanup.

## Architecture

### Rip out the runtime-CDN Leaflet + `window.__vueLeafletComponents` dance

- **Severity:** medium
- **Effort:** M (medium risk, touches both map components — verify on iOS)
- **Files:** `components/LeafletMap.vue`, `components/Lpolymarker.vue`, `nuxt.config.ts`, `plugins/leaflet.client.js`

The Leaflet npm dep is bundled (and its CSS imported via `plugins/leaflet.client.js`), but `LeafletMap.vue:45-88` *also* injects `unpkg.com/leaflet@1.9.4` JS+CSS at runtime — so Leaflet's CSS ships twice and there's an external runtime dependency for no reason. The reason it's wired this way is that `@vue-leaflet/vue-leaflet` reads `window.L` at module-evaluation time, which breaks under SSR.

Fix:

1. Set `ssr: false` in `nuxt.config.ts` (currently commented out at line 8). Every fetch is already gated on `onMounted` so SSR delivers an empty shell — you're paying SSR's complexity for zero benefit.
2. In a `.client.ts` plugin, do `const L = (await import('leaflet')).default; window.L = L;` before any vue-leaflet import.
3. Delete `loadLeafletFromCDN()` in `LeafletMap.vue` and the `<script src="unpkg...">` injection.
4. Delete `window.__vueLeafletComponents`, `getLeafletComponent()`, and the `setInterval(..., 200)` polling loop in `Lpolymarker.vue:324-340`.
5. Import `LMap`, `LImageOverlay`, `LGeoJson`, `LCircleMarker`, etc. directly from `@vue-leaflet/vue-leaflet`. Wrap in `<ClientOnly>` (or rely on `ssr: false`).

This is the single change that unlocks the rest of the cleanup — most of the other "smells" exist to work around this.

## API & data

### Centralize the API base URL

- **Severity:** low (medium if a staging environment is ever needed)
- **Effort:** S
- **Files:** all of: `pages/index.vue:166`, `pages/about.vue:60`, `pages/howtouse.vue:28`, `pages/research.vue:34`, `components/Navbar.vue:107`, `components/Lpolymarker.vue:92, 363`

`runtimeConfig.public.apiBaseUrl` is defined in `nuxt.config.ts:44` and never read. All seven call sites hardcode `https://wp.publictransport.is/wp-json`. Read `useRuntimeConfig().public.apiBaseUrl` in each call site.

### Replace `axios` with Nuxt's `$fetch` / `useFetch`

- **Severity:** low
- **Effort:** S
- **Files:** every file using `axios` (see list above)

Drops one dependency (`axios` ~30 KB), removes the `pages/index.vue` mixed `fetch` vs `axios` inconsistency, and `useFetch` would give proper SSR-data handling for free if SSR is ever turned back on.

## Bugs

### `pages/research.vue` is broken — Bootstrap-Vue not installed

- **Severity:** medium (page renders unstyled custom elements at `/research`)
- **Effort:** S (rewrite without `<b-container>`/`<b-row>`/`<b-col>`) or XS (delete if unused)
- **Files:** `pages/research.vue`

Either rewrite using Tailwind grid utilities or delete the route. Check whether anything links to `/research` before deleting.

### `beforeDestroy` is a Vue 2 hook in `layouts/default.vue:33`

- **Severity:** medium (resize listener leaks on unmount; `windowWidth` data is also unused — dead state)
- **Effort:** XS
- **Files:** `layouts/default.vue`

Replace `beforeDestroy` → `beforeUnmount`, or migrate to Composition API. While in there, delete the `windowWidth` data field — nothing references it.

## Styling

### Two disagreeing definitions of "primary" color

- **Severity:** low (cosmetic confusion; Tailwind color modifiers like `text-primary/50` won't work)
- **Effort:** S (verify visually after change)
- **Files:** `tailwind.config.js:17`, `layouts/default.vue:58, 92-110`

`tailwind.config.js` says `primary: #009de0` (cyan). `layouts/default.vue` defines `--primary: #0066cc` (deeper blue) and hand-rolls `.text-primary` / `.bg-primary` rules that override Tailwind's generated utilities. Net result: `text-primary` resolves to `#0066cc`, the Tailwind value is silently dead.

Pick one. Recommended: keep Tailwind's value, set it to whichever blue is correct, delete the CSS-var override block in `layouts/default.vue`.

### Viewport meta declared twice; `user-scalable=no` is an a11y regression

- **Severity:** medium (accessibility)
- **Effort:** S
- **Files:** `nuxt.config.ts:15`, `layouts/default.vue:42-51`

Layout's `viewport` wins (later in head merge), so the config entry is dead. The layout's content is `width=device-width, initial-scale=1, viewport-fit=cover, maximum-scale=1.0, user-scalable=no` — `user-scalable=no` and `maximum-scale=1.0` block pinch-zoom. The justification is iOS overscroll, but `position: fixed` on `body` (`layouts/default.vue:69-72`) already kills overscroll, so these flags are unnecessary collateral damage.

Fix: remove the duplicate from `nuxt.config.ts`. In the layout, drop `user-scalable=no` and `maximum-scale=1.0` (verify on iOS that overscroll really is killed by `position: fixed` alone).

## Cleanup

### Defensive dead-code loader in `pages/index.vue:43-50`

- **Severity:** low
- **Effort:** XS

The `<template v-else>` branch fires when `loaded=true` but `components.LMap` is falsy. By the time `LeafletMap` sets `loaded=true`, `LMap` is already in the components object — this branch never fires. Remove for clarity.

### Historical basemap SVGs in `public/`

- **Severity:** low (deploy bloat)
- **Effort:** XS

Only `pt20240711_en.svg` is referenced (`pages/index.vue:16`). These ship in every deploy but are unused: `pt2020-02_en.svg`, `pt2020-02_en2.svg`, `pt20220515_en.svg`, `ptkort2020.svg`. Decide whether to keep for archival or delete.

### Custom modal in `Lpolymarker.vue` could be a `<dialog>`

- **Severity:** low (a11y improvement)
- **Effort:** S–M

`Lpolymarker.vue:30` rolls its own modal with `Teleport` + click-outside + manual `z-50`. The native `<dialog>` element handles focus trapping, escape-to-close, and `::backdrop` for free. Worth doing only if you're touching this component for other reasons.

### `npm install` reports 31 vulnerabilities (4 low, 7 moderate, 18 high, 2 critical)

- **Severity:** unknown without inspection
- **Effort:** S (run `npm audit`, evaluate)

Most are likely transitive dev-dependencies. Worth a single audit pass and a targeted update — but `npm audit fix --force` is a footgun that can break Nuxt; do it carefully.

## UI/UX

From the 2026-05-04 designer review. Top three (marker discoverability, "Book now" weight, parallel marker fetch) are the highest leverage.

### Markers are invisible — zero discoverability for first-time users

- **Severity:** high (core conversion risk)
- **Effort:** S (hover highlight) + S (first-visit tooltip)
- **Files:** `pages/index.vue:33-34`, `components/Lpolymarker.vue` (`styleFunction`)

GeoJSON markers render at `opacity: 0` / `fillOpacity: 0`. A first-time visitor sees a static SVG with no affordance — no cursor change, no tooltip, no legend. On `mouseover`, apply a low-opacity fill (e.g. 15% of the route's `provider_color`) and switch to a pointer cursor. Add a one-time "Tap a region to see routes" tooltip persisted to `localStorage`. A small legend chip in the bottom corner doubles as hint and CTA.

### "Book now" CTA is undersized; modal footer is gated on `salesUrl`

- **Severity:** high (revenue-direct)
- **Effort:** S
- **Files:** `components/Lpolymarker.vue:112, 128`

Per-route "Book now" is a small outlined border button (`border border-primary text-primary rounded`) — looks secondary, competes with the route name link above. Footer "Book Tours in and Around X" CTA only renders when `salesUrl` is present on the marker.

Fix: invert per-route button to filled pill (`bg-primary text-white` + right-arrow icon, fixed min-width so it doesn't reflow). Always render the footer CTA, falling back to the first route's `sales_url` when no marker-level `salesUrl` exists.

### Parallel marker fetch + Leaflet CDN preconnect

- **Severity:** medium (perceived perf)
- **Effort:** S (preconnect + parallel fetch) / M (Promise-based script load)
- **Files:** `components/LeafletMap.vue`, `components/Lpolymarker.vue:336-353`, `nuxt.config.ts`

Waterfall today: CDN JS → `window.L` → vue-leaflet import → marker fetch. `Lpolymarker.vue` polls `window.L` every 200ms for up to 10s.

Quick wins: start `fetchMarkers()` in `onMounted` of `index.vue` independently of Leaflet (the data doesn't need `L`). Add `<link rel="preconnect" href="https://unpkg.com">` to `nuxt.config.ts` head. Replace `setInterval` polling with a Promise that resolves on script `onload`. **Note:** this is largely subsumed by the CDN-Leaflet rip-out (top of file); ship that first and most of this is moot.

### Modal: fetch on click, no skeleton — feels broken on slow networks

- **Severity:** medium
- **Effort:** S (skeleton) / M (prefetch on hover)
- **Files:** `components/Lpolymarker.vue:381` (`fetchRoutes`)

Loading state is bare pulsing bar + "Loading routes…" text in an empty modal. On slow mobile this can be 1–2s of blank. Replace with a skeleton mirroring the route row layout (badge square + two text lines + button outline). Optional follow-up: prefetch on `mouseenter`/`touchstart` of the GeoJSON layer.

### Mobile modal `max-h-[70vh]` clips content; no overflow indicator

- **Severity:** medium
- **Effort:** S (height + fade) / M (bottom-sheet pattern)
- **Files:** `components/Lpolymarker.vue:31, 536-549`

On iPhone SE (~667px), 70vh leaves ~272px for routes after header/footer. Styled scrollbar is webkit-only — invisible on Firefox and iOS Safari. No fade/gradient mask to signal overflow. Raise to 85vh (safe — `body` is `position: fixed`), add a bottom `mask-image` gradient when content overflows. Stretch: bottom-sheet pattern with drag handle on mobile.

### Ad banner: third blue, 300×250 covers ~37% of small viewports, dismissal not persisted

- **Severity:** medium
- **Effort:** S
- **Files:** `components/AdBanner.vue:43`

Banner uses `linear-gradient(#007bff, #0056b3)` — a third blue not present elsewhere. On mobile, 300×250 medium-rectangle covers ~37% of an iPhone SE. `localStorage` dismissal is commented out, so each refresh re-shows. Switch mobile to a slim full-width bottom bar (~56px, with `safe-area-inset-bottom`), use the brand's actual colors, persist dismissal for 7 days, add a transport icon.

### Zero keyboard nav on map markers; modal lacks Escape key + aria-label

- **Severity:** medium (WCAG 2.1 AA)
- **Effort:** S (modal a11y) / M (accessible marker list)
- **Files:** `components/Lpolymarker.vue:9, 38`

`LGeoJson` click handlers have no `tabindex`, `role`, or keyboard event handlers — keyboard users can't open a marker. Modal close button has no `aria-label`. Escape key not wired.

Fix: `@keydown.escape="modalShow = false"` on the modal wrapper (`tabindex="-1"` + `focus()` on open), `aria-label="Close"` on close button. For markers, add a visually-hidden DOM list of all destinations as `<button>` elements that call `markerClick` — sighted users get the map, AT users get the list.

### Loading state is a gray screen; the static SVG could fill it instantly

- **Severity:** low (perceived perf)
- **Effort:** S
- **Files:** `pages/index.vue:44-50`

While Leaflet boots, users see "Loading map components…" on a blank gray screen. The SVG basemap (`/pt20240711_en.svg`) is a static file — render it as a non-interactive `<img>` (or CSS background) in the loading slot, fade out when the interactive map mounts. Near-instant first contentful paint.

### Typography: Inter everywhere, weights are flat, no scanning hierarchy in modal

- **Severity:** low
- **Effort:** S
- **Files:** `assets/css/main.css:7`, `components/Lpolymarker.vue` (modal headings)

`*` selector applies Inter globally. Route destination names are `1.05rem` — barely larger than body. Modal `h1` has no explicit size. `.ptitle` ("Transport to and from") is `16px uppercase` — same weight as body. Tighten weight/size discipline within Inter (route names `font-semibold text-base`, modal title `text-xl font-bold`, providers `text-xs text-gray-500`). No new font required.

### Navbar `#a10b0b` red is a brand orphan

- **Severity:** low
- **Effort:** S
- **Files:** `components/Navbar.vue:2`, `assets/css/main.css` (`prose a` rules)

Dark red appears only in the navbar and `prose a` on `/about` and `/howtouse`. Map page is blue-toned; the result reads as two products. Either commit to red as the brand accent (use it for the modal footer CTA, replacing blue) or replace navbar with the app blue. Related to (and should be resolved alongside) the existing "two disagreeing definitions of primary color" item above.

### Ferry vs car-ferry icons identical; critical for tourists with rental cars

- **Severity:** low
- **Effort:** S
- **Files:** `components/Lpolymarker.vue:63-66`

Both `route.ferry` and `route.carferry` render `directions_boat`. Car-ferry distinction is critical trip-planning info for tourists. Use a composed icon or different glyph for car ferries; promote "Car ferry |" from the provider line to a small pill badge above the route name.

## Maybe-rewrite (deferred)

Not a defect, just a strategic option. The architect recommended **fix in place over rewrite** for this side-project. If a rewrite is ever pursued, the honest pick for this app's shape (one-page static-ish, WP backend, no SEO-heavy content) is **Vite + Vue 3 SPA, no Nuxt** — removes the framework that's causing 80% of the friction, vue-leaflet works trivially client-side, components stay portable. Astro is fashionable but the vue-leaflet `window.L` issue resurfaces inside a client island.
