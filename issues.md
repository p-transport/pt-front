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

## Maybe-rewrite (deferred)

Not a defect, just a strategic option. The architect recommended **fix in place over rewrite** for this side-project. If a rewrite is ever pursued, the honest pick for this app's shape (one-page static-ish, WP backend, no SEO-heavy content) is **Vite + Vue 3 SPA, no Nuxt** — removes the framework that's causing 80% of the friction, vue-leaflet works trivially client-side, components stay portable. Astro is fashionable but the vue-leaflet `window.L` issue resurfaces inside a client island.
