# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install          # install deps (runs `nuxt prepare` postinstall)
npm run dev          # dev server on http://localhost:3000
npm run build        # production build
npm run generate     # static site (output in .output/public)
npm run preview      # preview production build
```

There is no test runner, linter, or formatter configured. The `linter-fix*.ts` files inside `plugins/` are stray artifacts (likely from an editor) — they are not loaded as plugins and can be ignored or deleted.

`GOOGLE_ANALYTICS_ID` is read at runtime via `runtimeConfig.public.googleAnalyticsMeasurementId` (see `nuxt.config.ts`).

## Architecture

Nuxt 3 (Vue 3 Composition API) frontend for **PublicTransport.is** — an interactive map of Iceland public-transport routes. The data layer is a **WordPress REST API** at `https://wp.publictransport.is/wp-json` (configured in `runtimeConfig.public.apiBaseUrl`, but most call sites currently hardcode the URL).

### Map rendering: SVG overlay on CRS.Simple, not tiles

This is the key architectural quirk. The map is **not** a normal geographic Leaflet map. Instead:

- `pages/index.vue` mounts a Leaflet map whose CRS is set to `L.CRS.Simple` after init (see `setupMapOptions` in `onMapReady`).
- A single `LImageOverlay` of `/pt20240711_en.svg` (in `public/`) acts as the basemap.
- The map `bounds` and `center`/`zoom` are tuned to the SVG's coordinate space, **not** to lat/lng. Don't replace these with geographic constants.
- Responsive `computedZoom`/`computedCenter` shift the view leftward on narrow viewports so the SVG stays visible alongside the floating ad banner.

### Leaflet loading: CDN at runtime, not the npm bundle

`components/LeafletMap.vue` is a wrapper that:

1. Injects Leaflet's CSS/JS from `unpkg.com/leaflet@1.9.4` at runtime (the npm `leaflet` dep is in `transpile` but the runtime copy is the CDN one — `window.L` comes from there).
2. Dynamically imports `@vue-leaflet/vue-leaflet` after Leaflet is on `window`.
3. Stashes the components on `window.__vueLeafletComponents` (also exposed via slot prop `components`).

Children (e.g. `Lpolymarker.vue`) read components off `window.__vueLeafletComponents` rather than importing them directly, because vue-leaflet requires `window.L` to exist before its module is evaluated. If you add a new vue-leaflet component, register it in **both** `loadVueLeaflet()` in `LeafletMap.vue` and the dynamic-import paths in `Lpolymarker.vue`. All Leaflet-using markup must be inside `<ClientOnly>`.

### Marker flow

1. `pages/index.vue` fetches `GET /pt/v1/markers` and gets a list of marker records (each has `slug`, `geojson`, `color`, `sales_url`, …).
2. Each marker becomes an `Lpolymarker` rendered as an `LGeoJson` shape (or `LCircleMarker` fallback). With `?debug=1` in the URL, the GeoJSON shapes become visible (otherwise opacity 0 — they're invisible click targets over the SVG).
3. On click, `Lpolymarker` fetches `GET /pt/v1/marker-routes/{slug}` and opens a modal listing routes/providers with booking links.

### Other API endpoints

- `GET /pt/v1/options` — used by `Navbar.vue` for the "info" link, the dropdown PDF schedule links, and the dropdown title.

### Analytics

`plugins/google-analytics.client.js` provides `$gtag(eventName, action, params)` via `useNuxtApp()`. It is a no-op when no valid `G-…` measurement ID is configured (and explicitly skips the placeholder ID `G-877BES8YN8`). Tracked events and parameter shapes are documented in `ANALYTICS.md` — keep that file in sync when adding events.

### Styling

Tailwind via `@nuxtjs/tailwindcss`. Custom color `primary: #009de0` in `tailwind.config.js`, but `layouts/default.vue` defines a CSS variable `--primary: #0066cc` and Tailwind-style utility classes (`.text-primary`, `.bg-primary`, etc.) that resolve to the variable — these two values disagree, so when changing the brand color, update both. Global CSS in `assets/css/main.css` and `assets/css/leaflet.css`.

iOS handling: `<body>` is `position: fixed` to disable overscroll, and `env(safe-area-inset-*)` is used for the map container and floating ad banner. The viewport meta is set in `layouts/default.vue` (with `viewport-fit=cover`) — note this duplicates `nuxt.config.ts`'s `app.head.meta`, and the layout's value wins on the rendered page.

### Dead/legacy artifacts

- `app.html` is a Nuxt 2 template and is **not used** by Nuxt 3 — head/meta config lives in `nuxt.config.ts` and `layouts/default.vue`.
- `store/index.js` is entirely commented out — there is no Vuex/Pinia store in use.
- `_reference/`, `85_vottun.sql.bz2`, and the `.vercel/` directory are local references; not part of the runtime app.
- `pages/test-ad.vue` is an isolated playground for the `AdBanner` component.
