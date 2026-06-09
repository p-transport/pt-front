<template>
  <div class="map-container">
    <LeafletMap>
      <LMap ref="map"
            :zoom="computedZoom"
            :center="computedCenter"
            :use-global-leaflet="true"
            :options="mapOptions"
            @ready="onMapReady">
        <!-- SVG image overlay basemap (CRS.Simple, not geographic tiles) -->
        <LImageOverlay url="/pt20260609_en.svg"
                       :bounds="bounds"
                       :opacity="1"
                       layer-type="base"
                       name="Public Transport Map" />

        <LControlAttribution position="bottomright"
                             prefix="&copy; 2026 Cartography: Hugarflug ehf / Ingi Gunnar Jóhannsson. Published by <a href='https://www.hjolafaerni.is' target='_blank'>Hjólafærni á Íslandi</a> – All rights reserved" />
        <LControlZoom position="bottomright" />

        <template v-for="marker in parsedMarkers" :key="marker.slug">
          <Lpolymarker
            :title="marker.title"
            :slug="marker.slug"
            :geojson="marker._geojson"
            :color="marker.color || '#ff0000'"
            :opacity="debugMode ? 0.6 : 0"
            :fillOpacity="debugMode ? 0.4 : 0"
            :weight="marker.weight || 2"
            :radius="marker.radius || 10"
            :sales-url="marker.sales_url"
            :debug-mode="debugMode"
            :operator-map-url="operatorMapUrl"
            :intro-delay="marker.introDelay"
          />
        </template>
      </LMap>
    </LeafletMap>

    <!-- Floating Ad Banner -->
    <div class="floating-ad-container">
      <AdBanner :size="adBannerSize" />
    </div>

    <!-- Debug mode indicator -->
    <div v-if="debugMode" class="debug-indicator">
      <div class="bg-red-600 text-white px-3 py-1 rounded shadow-lg text-sm">
        Debug Mode Active
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, markRaw, computed, onUnmounted } from 'vue'
import {
  LMap,
  LImageOverlay,
  LControlZoom,
  LControlAttribution
} from '@vue-leaflet/vue-leaflet'
import Lpolymarker from '~/components/Lpolymarker.vue'
import LeafletMap from '~/components/LeafletMap.vue'
import AdBanner from '~/components/AdBanner.vue'

export default {
  components: {
    LMap,
    LImageOverlay,
    LControlZoom,
    LControlAttribution,
    Lpolymarker,
    LeafletMap,
    AdBanner
  },
  
  setup() {
    const map = ref(null)
    const markers = ref([])
    const operatorMapUrl = ref('')
    const debugMode = ref(false) // Default debug mode to false
    const windowWidth = ref(window.innerWidth)
    
    // Set bounds for Iceland SVG map - these should match your SVG bounds
    const bounds = ref([
      [83.8, -157.5],
      [-44.7, 147.8]
    ])
    
    // Compute zoom level based on screen width
    const computedZoom = computed(() => {
      if (windowWidth.value < 480) {
        return 1.8;
      } else if (windowWidth.value < 768) {
        return 2.0;
      } else if (windowWidth.value < 1520) {
        return 2.3;
      } else if (windowWidth.value < 1600) {
        return 2.8;
      } else {
        return 3.0; // Extra-wide monitors
      }
    })
    
    // Compute center point based on screen width to shift view to the left on mobile
    const computedCenter = computed(() => {
      // For smaller phones, shift the center even more to the left
      if (windowWidth.value < 480) {
        return [47.313220, -80.319482]; // Very significant shift for small phones
      } 
      // For tablets, shift moderately to the left
      else if (windowWidth.value < 768) {
        return [47.313220, -60.319482]; // Moderate shift for tablets
      } 
      // Use default center for desktop
      else {
        return [47.313220, -1.319482];
      }
    })
    
    const mapOptions = markRaw({
      zoomControl: false,
      attributionControl: false,
      preferCanvas: false,
      zoomSnap: 0.1,
      maxZoom: 10,
      minZoom: 0
    })
    
    // Store original body/html styles
    let originalHtmlOverflow = ''
    let originalHtmlPosition = ''
    let originalHtmlWidth = ''
    let originalBodyOverflow = ''
    let originalBodyPosition = ''
    let originalBodyWidth = ''

    // Function to parse GeoJSON safely
    function parsedGeoJson(geoJson) {
      if (!geoJson) return null
      
      try {
        // If it's already an object, return it
        if (typeof geoJson === 'object') return geoJson
        
        // If it's a string, try to parse it
        if (typeof geoJson === 'string') {
          return JSON.parse(geoJson)
        }
        
        return null
      } catch (error) {
        console.error('Error parsing GeoJSON:', error)
        return null
      }
    }

    function nwToSeScore(geojson) {
      if (!geojson) return 0.5
      try {
        const coords = []
        function collect(c) {
          if (typeof c[0] === 'number') coords.push(c)
          else c.forEach(collect)
        }
        const geom = geojson.geometry || geojson
        if (geom?.coordinates) collect(geom.coordinates)
        if (!coords.length) return 0.5
        const avgLng = coords.reduce((s, c) => s + c[0], 0) / coords.length
        const avgLat = coords.reduce((s, c) => s + c[1], 0) / coords.length
        // Iceland: lat 63–67°N, lng –24 to –13°E; NW→SE increases
        const normLng = (avgLng + 24) / 11
        const normLat = (67 - avgLat) / 4
        return Math.max(0, Math.min(1, (normLng + normLat) / 2))
      } catch (e) {
        return 0.5
      }
    }

    const parsedMarkers = computed(() => {
      const withGeo = markers.value.map(m => ({ ...m, _geojson: parsedGeoJson(m.geojson) }))
      const scored = withGeo.map(m => ({ ...m, _score: nwToSeScore(m._geojson) }))
      scored.sort((a, b) => a._score - b._score)
      const n = scored.length
      return scored.map((m, i) => ({
        ...m,
        introDelay: n > 1 ? (i / (n - 1)) * 0.2 : 0
      }))
    })

    async function fetchMarkers() {
      try {
        const response = await fetch('https://wp.publictransport.is/wp-json/pt/v1/markers')
        const data = await response.json()
        markers.value = data
        // console.log(`Fetched ${data.length} markers`)
      } catch (error) {
        console.error('Error fetching markers:', error)
      }
    }

    async function fetchOptions() {
      try {
        const response = await fetch('https://wp.publictransport.is/wp-json/pt/v1/options')
        const data = await response.json()
        if (data?.links && Array.isArray(data.links)) {
          const enLink = data.links.find(l => l.file && l.file.includes('_en')) || data.links[0]
          if (enLink?.file) operatorMapUrl.value = enLink.file
        }
      } catch (error) {
        console.error('Error fetching options:', error)
      }
    }

    function onMapReady(mapObject) {
      map.value = mapObject
      if (mapObject?.leafletObject) {
        mapObject.leafletObject.setMaxBounds(bounds.value)
        mapObject.leafletObject.invalidateSize()
      }
    }

    // Compute the appropriate ad banner size based on window width
    const adBannerSize = computed(() => {
      if (windowWidth.value >= 768) {
        return 'leaderboard' // Desktop size
      } else if (windowWidth.value >= 480) {
        return 'large-mobile' // Tablet size
      } else {
        return 'medium-rectangle' // Mobile size - more visible on small screens
      }
    })

    onMounted(async () => {
      //console.log('Index page mounted')
      
      // Disable scrolling for index page
      if (typeof window !== 'undefined') {
        originalHtmlOverflow = document.documentElement.style.overflow
        originalHtmlPosition = document.documentElement.style.position
        originalHtmlWidth = document.documentElement.style.width
        originalBodyOverflow = document.body.style.overflow
        originalBodyPosition = document.body.style.position
        originalBodyWidth = document.body.style.width

        document.documentElement.style.overflow = 'hidden'
        document.documentElement.style.position = 'fixed'
        document.documentElement.style.width = '100%'
        document.body.style.overflow = 'hidden'
        document.body.style.position = 'fixed'
        document.body.style.width = '100%'
      }
      
      window.addEventListener('resize', handleResize)
      
      // Check for debug parameter in URL
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search)
        const debugParam = urlParams.get('debug')
        debugMode.value = debugParam === 'true' || debugParam === '1'
        
        if (debugMode.value) {
          console.log('Debug mode enabled for map regions')
        }
      }
      
      await Promise.all([fetchMarkers(), fetchOptions()])
    })
    
    // Handle window resize
    const handleResize = () => {
      windowWidth.value = window.innerWidth
      
      // Force map to update with new zoom level when window is resized
      if (map.value && map.value.leafletObject) {
        map.value.leafletObject.setZoom(computedZoom.value)
        // Update center position based on viewport size
        map.value.leafletObject.setView(computedCenter.value, computedZoom.value, { animate: true });
        // Invalidate size to ensure proper rendering
        map.value.leafletObject.invalidateSize()
      }
    }
    
    // Add onUnmounted hook to restore scrolling
    onUnmounted(() => {
      console.log('Index page unmounted')
      if (typeof window !== 'undefined') {
        document.documentElement.style.overflow = originalHtmlOverflow
        document.documentElement.style.position = originalHtmlPosition
        document.documentElement.style.width = originalHtmlWidth
        document.body.style.overflow = originalBodyOverflow
        document.body.style.position = originalBodyPosition
        document.body.style.width = originalBodyWidth
      }

      // Clean up resize listener
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize)
      }
    })

    return {
      map,
      parsedMarkers,
      operatorMapUrl,
      bounds,
      mapOptions,
      debugMode,
      onMapReady,
      adBannerSize,
      computedZoom,
      computedCenter
    }
  }
}
</script>

<style>
.map-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100vh;
  z-index: 5;
  margin-top: 0;
}

@media (max-width: 768px) {
  .map-container {
    bottom: env(safe-area-inset-bottom, 0px);
    height: calc(100vh - env(safe-area-inset-bottom, 0px));
  }

  .leaflet-bottom {
    padding-bottom: max(env(safe-area-inset-bottom, 40px), 40px);
  }
}

.debug-indicator {
  position: fixed;
  top: 70px; /* Move to top right instead of bottom right */
  right: 20px;
  z-index: 1000;
}

/* Floating Ad Banner styles */
.floating-ad-container {
  position: fixed;
  bottom: 30px; /* Position from bottom */
  left: 50%;
  transform: translateX(-50%);
  z-index: 900; /* Above map but below controls */
  width: auto;
  max-width: 100%;
  padding: 0 10px;
  box-sizing: border-box;
  pointer-events: auto; /* Allow clicking on the ad */
}

/* Responsive styles for ad container */
@media (max-width: 768px) {
  .floating-ad-container {
    bottom: calc(40px + env(safe-area-inset-bottom, 0px));
  }
}

@media (max-width: 480px) {
  .floating-ad-container {
    padding: 0 12px;
  }
}
</style>
