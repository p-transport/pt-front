# PublicTransport.is

Interactive map of Iceland's public-transport routes. Built with Nuxt 4 and Leaflet.

## Getting started

```bash
npm install       # install deps (runs nuxt prepare postinstall)
npm run dev       # dev server → http://localhost:3000
npm run build     # production build
npm run generate  # static output → .output/public
npm run preview   # preview production build
npm run deploy    # build + deploy via deploy.sh
```

Requires **Node 22+**.

## Environment variables

| Variable | Description |
|---|---|
| `GOOGLE_ANALYTICS_ID` | GA4 Measurement ID (e.g. `G-XXXXXXXXXX`). Omit or leave as placeholder to disable tracking. |

## Architecture

### Map rendering

The map is a Leaflet instance with `L.CRS.Simple` (not a tile-based geographic map). A single SVG (`/public/pt20240711_en.svg`) is mounted as an `LImageOverlay` and acts as the basemap. Coordinates are in SVG space, not lat/lng — don't substitute geographic constants.

On narrow viewports, `computedZoom`/`computedCenter` in `pages/index.vue` shift the view leftward so the map stays visible beside the ad banner.

### Leaflet loading

`components/LeafletMap.vue` injects Leaflet from the CDN (`unpkg.com/leaflet@1.9.4`) at runtime, then dynamically imports `@vue-leaflet/vue-leaflet` once `window.L` exists. The resolved components are stashed on `window.__vueLeafletComponents`. Child components (e.g. `Lpolymarker.vue`) read from there rather than importing vue-leaflet directly. All Leaflet markup must be inside `<ClientOnly>`.

If you add a new vue-leaflet component, register it in both `loadVueLeaflet()` in `LeafletMap.vue` and the dynamic-import paths in `Lpolymarker.vue`.

### Data layer

All data comes from the WordPress REST API at `https://wp.publictransport.is/wp-json`.

| Endpoint | Used by |
|---|---|
| `GET /pt/v1/markers` | `pages/index.vue` — loads all map markers on mount |
| `GET /pt/v1/marker-routes/{slug}` | `Lpolymarker.vue` — fetches routes on marker click |
| `GET /pt/v1/options` | `Navbar.vue` — info link, PDF schedule links, dropdown title |

### Marker flow

1. `index.vue` fetches `/pt/v1/markers` and renders one `Lpolymarker` per record.
2. Each marker renders as an `LGeoJson` shape (or `LCircleMarker` fallback) with opacity 0 — invisible click targets over the SVG. Add `?debug=1` to the URL to make shapes visible.
3. On click, `Lpolymarker` fetches `/pt/v1/marker-routes/{slug}` and opens a modal with routes, providers, and booking links.

### Analytics

`plugins/google-analytics.client.js` provides `$gtag(eventName, action, params)` via `useNuxtApp()`. It is a no-op when no valid `G-…` ID is configured. See `ANALYTICS.md` for the full event catalogue.

### Styling

Tailwind CSS via `@nuxtjs/tailwindcss`. Global styles in `assets/css/main.css` and `assets/css/leaflet.css`. Brand color is defined in two places that must stay in sync: `tailwind.config.js` (`primary: #009de0`) and the CSS variable in `layouts/default.vue` (`--primary: #0066cc`).

iOS: `<body>` is `position: fixed` to prevent overscroll; `env(safe-area-inset-*)` is used for the map container and ad banner.

## Updating the map SVG

```bash
npm run update-map   # runs scripts/update-map.sh
```

## Pages

| Route | File | Description |
|---|---|---|
| `/` | `pages/index.vue` | Interactive route map |
| `/about` | `pages/about.vue` | About page |
| `/howtouse` | `pages/howtouse.vue` | How to use |
| `/cookies` | `pages/cookies.vue` | Cookie policy |
| `/viewer` | `pages/viewer.vue` | Route viewer |
