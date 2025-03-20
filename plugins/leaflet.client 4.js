// This plugin is only loaded on the client side
export default defineNuxtPlugin(() => {
  if (process.client) {
    // Import Leaflet CSS
    import('leaflet/dist/leaflet.css')
  }
}) 