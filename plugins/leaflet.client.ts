import * as Leaflet from 'leaflet/dist/leaflet-src.esm.js'
import 'leaflet/dist/leaflet.css'

// vue-leaflet's `useGlobalLeaflet: true` mode reads `window.L`, and
// `pages/index.vue` references `window.L.CRS.Simple` directly. Leaflet's
// ESM build only has named exports (no default), so `import * as` returns
// a frozen Module namespace — assigning that to `window.L` breaks any code
// that mutates the global (e.g. vue-leaflet sets `Icon.Default` options).
// Spread into a plain object so it's mutable.
export default defineNuxtPlugin(() => {
  if (typeof window !== 'undefined') {
    ;(window as any).L = { ...Leaflet }
  }
})
