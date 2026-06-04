<template>
  <div class="w-full h-full relative">
    <div id="leaflet-container" class="w-full h-full">
      <ClientOnly>
        <slot></slot>
      </ClientOnly>
    </div>
  </div>
</template>

<script setup>
// Thin styled container for the Leaflet map. Leaflet itself and
// `window.L` are initialised in `plugins/leaflet.client.ts`; vue-leaflet
// components are imported directly by consumers (e.g. pages/index.vue).
</script>

<style>
/* Ensure the Leaflet map container takes full height */
#leaflet-container {
  min-height: calc(100vh - 52px);
  min-height: calc(100vh - 52px - env(safe-area-inset-top) - env(safe-area-inset-bottom));
  /* Fallback for browsers that don't support env() */
  min-height: -webkit-fill-available;
  height: 100%;
  position: relative;
}

/* iOS-specific fixes */
@supports (-webkit-touch-callout: none) {
  #leaflet-container {
    /* Ensure content doesn't go under the URL bar */
    padding-top: env(safe-area-inset-top);
    padding-bottom: env(safe-area-inset-bottom);
  }
}
</style>
