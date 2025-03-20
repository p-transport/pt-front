<template>
  <div class="map-container">
    <LeafletMap v-slot="{ components }">
      <template v-if="components && components.LMap">
        <component :is="components.LMap" 
                  ref="map"
                  :zoom="zoom" 
                  :center="center" 
                  :bounds="bounds" 
                  :use-global-leaflet="true"
                  :options="mapOptions"
                  @ready="onMapReady">
          <!-- Replace tile layer with SVG image overlay -->
          <component :is="components.LImageOverlay"
                     url="/pt20240711_en.svg" 
                     :bounds="bounds"
                     :opacity="1"
                     layer-type="base"
                     name="Public Transport Map" />
                     
          <component :is="components.LControlZoom" position="topright" />
          <component :is="components.LControlAttribution" 
                      position="bottomright" 
                      prefix="&copy; 2025 Cartography: Hugarflug ehf / Ingi Gunnar Jóhannsson. Published by <a href='https://www.hjolafaerni.is' target='_blank'>Hjólafærni á Íslandi</a> – All rights reserved" />
          
          <!-- Use the markers directly -->
          <template v-for="(marker, index) in markers" :key="index">
            <Lpolymarker
              :title="marker.title"
              :slug="marker.slug"
              :geojson="parsedGeoJson(marker.geojson)"
              :color="marker.color || '#ff0000'"
              :opacity="debugMode ? 0.6 : 0"
              :fillOpacity="debugMode ? 0.4 : 0"
              :weight="marker.weight || 2"
              :radius="marker.radius || 10"
              :sales-url="marker.sales_url"
              :debug-mode="debugMode"
            />
          </template>
        </component>
      </template>
      <template v-else>
        <div class="flex items-center justify-center h-full">
          <div class="text-center">
            <div class="text-xl font-semibold mb-2">Loading map components...</div>
            <div class="animate-pulse bg-gray-200 rounded-full h-2.5 w-24 mx-auto"></div>
          </div>
        </div>
      </template>
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
import { ref, onMounted, reactive, markRaw, computed, onUnmounted } from 'vue'
import axios from 'axios'
import Lpolymarker from '~/components/Lpolymarker.vue'
import LeafletMap from '~/components/LeafletMap.vue'
import AdBanner from '~/components/AdBanner.vue'

export default {
  components: {
    Lpolymarker,
    LeafletMap,
    AdBanner
  },
  
  setup() {
    const map = ref(null)
    const markers = ref([])
    const debugMode = ref(false) // Default debug mode to false
    const windowWidth = ref(0) // Track window width for responsive design
    
    // Map settings adjusted for Iceland SVG
    const zoom = ref(2.5)
    const center = ref([47.313220, -1.319482])
    
    // Set bounds for Iceland SVG map - these should match your SVG bounds
    const bounds = ref([
      [83.287664, -159.522857], 
      [-44.391598, 149.762878]
    ])
    
    // Map options with explicit attribution and zoom control settings
    const mapOptions = markRaw({
      zoomControl: false, // We'll add this separately
      attributionControl: false, // We'll add this separately
      preferCanvas: false, // SVG renderer works better with imageOverlay
      zoomSnap: 0.1,
      maxZoom: 10,
      minZoom: 0
    })
    
    // Function to setup CRS.Simple when Leaflet is ready
    function setupMapOptions(mapObject) {
      if (mapObject && mapObject.leafletObject) {
        // Set CRS to Simple after Leaflet is loaded
        mapObject.leafletObject.options.crs = window.L.CRS.Simple
        console.log('Set CRS to Simple')
      }
    }

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

    async function fetchMarkers() {
      try {
        const response = await fetch('https://wp.publictransport.is/wp-json/pt/v1/markers')
        const data = await response.json()
        markers.value = data
        console.log(`Fetched ${data.length} markers`)
      } catch (error) {
        console.error('Error fetching markers:', error)
      }
    }

    function onMapReady(mapObject) {
      console.log('Map is ready')
      map.value = mapObject
      
      // You can interact with the map object here if needed
      if (mapObject && mapObject.leafletObject) {
        // Configure map settings including CRS
        setupMapOptions(mapObject)
        
        // Set bounds
        mapObject.leafletObject.setMaxBounds(bounds.value)
        
        // Force a redraw of the map after a short delay
        setTimeout(() => {
          mapObject.leafletObject.invalidateSize()
        }, 200)
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
      console.log('Index page mounted')
      
      // Set initial window width
      if (typeof window !== 'undefined') {
        windowWidth.value = window.innerWidth
        
        // Add resize listener for responsive design
        window.addEventListener('resize', handleResize)
      }
      
      // Check for debug parameter in URL
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search)
        const debugParam = urlParams.get('debug')
        debugMode.value = debugParam === 'true' || debugParam === '1'
        
        if (debugMode.value) {
          console.log('Debug mode enabled for map regions')
        }
      }
      
      // Fetch markers after component is mounted
      await fetchMarkers()
      
      // Trigger resize event to ensure map renders correctly after a delay
      setTimeout(() => {
        if (typeof window !== 'undefined' && window.dispatchEvent) {
          window.dispatchEvent(new Event('resize'))
        }
      }, 500)
    })
    
    // Handle window resize
    const handleResize = () => {
      windowWidth.value = window.innerWidth
    }
    
    // Clean up event listener on unmount
    onUnmounted(() => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize)
      }
    })

    return {
      map,
      markers,
      zoom,
      center,
      bounds,
      mapOptions,
      debugMode,
      parsedGeoJson,
      onMapReady,
      adBannerSize
    }
  }
}
</script>

<style>
.map-container {
  position: absolute;
  top: 52px; /* Adjusted from 56px to remove the gap */
  left: 0;
  right: 0;
  bottom: 0; /* Extend to bottom of the screen */
  width: 100%;
  height: calc(100vh - 52px); /* Full height minus navbar */
  z-index: 5; /* Lower than navbar (50) */
  margin-top: 0;
}

@media (max-width: 768px) {
  .map-container {
    /* Full height on mobile */
    bottom: env(safe-area-inset-bottom, 0px); /* Only account for iOS safe area */
    height: calc(100vh - 52px - env(safe-area-inset-bottom, 0px));
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
    bottom: calc(40px + env(safe-area-inset-bottom, 0px)); /* Adjust for iOS safe area */
  }
}

@media (max-width: 480px) {
  .floating-ad-container {
    /* Switch to mobile banner size on very small screens */
    width: 100%;
    padding: 0 5px;
  }
}
</style>
