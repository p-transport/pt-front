<template>
  <div class="w-full h-full relative">
    <div id="leaflet-container" class="w-full h-full">
      <div v-if="!loaded" class="flex items-center justify-center h-full">
        <div class="text-center">
          <div class="text-xl font-semibold mb-2">Loading map components...</div>
          <div class="animate-pulse bg-gray-200 rounded-full h-2.5 w-24 mx-auto"></div>
        </div>
      </div>
      
      <div v-if="error" class="absolute top-0 left-0 right-0 bg-red-100 text-red-800 p-4 border-b border-red-200">
        <p>{{ error }}</p>
      </div>
      
      <slot v-if="!loaded" name="loading">
        <div class="flex items-center justify-center h-full">
          <div class="text-center">
            <div class="text-xl font-semibold mb-2">Loading map components...</div>
            <div class="animate-pulse bg-gray-200 rounded-full h-2.5 w-24 mx-auto"></div>
          </div>
        </div>
      </slot>
      
      <ClientOnly>
        <slot v-if="loaded" :components="leafletComponents"></slot>
      </ClientOnly>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, markRaw, shallowRef } from 'vue'

export default {
  name: 'LeafletMap',
  
  setup() {
    const loaded = ref(false)
    const error = ref(null)
    // Use shallowRef for the components to avoid reactivity issues
    const leafletComponents = shallowRef({})
    let leafletLoadTimeout = null
    
    // Direct CDN import of Leaflet (more reliable in Nuxt)
    function loadLeafletFromCDN() {
      return new Promise((resolve, reject) => {
        // Only load if not already loaded
        if (typeof window !== 'undefined' && !window.L) {
          console.log('Loading Leaflet from CDN...')
          
          // Add Leaflet CSS
          const cssLink = document.createElement('link')
          cssLink.rel = 'stylesheet'
          cssLink.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
          document.head.appendChild(cssLink)
          
          // Add Leaflet JS
          const script = document.createElement('script')
          script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
          script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo='
          script.crossOrigin = ''
          
          script.onload = () => {
            console.log('Leaflet loaded from CDN successfully')
            resolve(window.L)
          }
          
          script.onerror = (e) => {
            console.error('Failed to load Leaflet from CDN:', e)
            reject(new Error('Failed to load Leaflet from CDN'))
          }
          
          document.head.appendChild(script)
          
          // Set a timeout in case script loading hangs
          leafletLoadTimeout = setTimeout(() => {
            reject(new Error('Leaflet loading timed out'))
          }, 10000)
        } else if (typeof window !== 'undefined' && window.L) {
          // Leaflet already loaded
          console.log('Leaflet already loaded')
          resolve(window.L)
        } else {
          // Not in browser
          reject(new Error('Not running in browser'))
        }
      })
    }
    
    async function loadVueLeaflet() {
      try {
        console.log('Loading vue-leaflet components...')
        const vueLeaflet = await import('@vue-leaflet/vue-leaflet')
        
        // Only register components if we got them
        if (vueLeaflet) {
          // Use markRaw to prevent Vue from making these components reactive
          const components = markRaw({
            LMap: vueLeaflet.LMap,
            LTileLayer: vueLeaflet.LTileLayer,
            LGeoJson: vueLeaflet.LGeoJson,
            LCircleMarker: vueLeaflet.LCircleMarker,
            LMarker: vueLeaflet.LMarker,
            LControlZoom: vueLeaflet.LControlZoom,
            LControlAttribution: vueLeaflet.LControlAttribution,
            LImageOverlay: vueLeaflet.LImageOverlay,
            LPolyline: vueLeaflet.LPolyline,
            LPolygon: vueLeaflet.LPolygon
          })
          
          // Set components without triggering reactivity
          leafletComponents.value = components
          
          // Make components globally available
          if (typeof window !== 'undefined') {
            if (!window.__vueLeafletComponents) {
              window.__vueLeafletComponents = {}
            }
            
            // Use non-reactive global registry
            window.__vueLeafletComponents = {
              ...window.__vueLeafletComponents,
              ...components
            }
          }
          
          console.log('Vue-Leaflet components loaded')
          return true
        }
        return false
      } catch (err) {
        console.error('Error loading vue-leaflet:', err)
        throw err
      }
    }
    
    onMounted(async () => {
      console.log('LeafletMap mounted, loading Leaflet...')
      
      // Skip if not running in browser
      if (typeof window === 'undefined') {
        console.log('Not running in browser, skipping Leaflet load')
        return
      }
      
      try {
        // Load Leaflet from CDN
        await loadLeafletFromCDN()
        
        // Clear timeout if it was set
        if (leafletLoadTimeout) {
          clearTimeout(leafletLoadTimeout)
          leafletLoadTimeout = null
        }
        
        // Load vue-leaflet components
        await loadVueLeaflet()
        
        // Set as loaded
        loaded.value = true
        
        // Trigger resize event to ensure map renders correctly
        setTimeout(() => {
          if (window.dispatchEvent) {
            window.dispatchEvent(new Event('resize'))
            console.log('Resize event dispatched')
          }
        }, 300)
        
        console.log('LeafletMap component fully initialized')
      } catch (err) {
        console.error('Error loading Leaflet components:', err)
        error.value = 'Failed to load map components. Please try refreshing the page.'
      }
    })
    
    // Clean up timeout if component is destroyed
    onUnmounted(() => {
      if (leafletLoadTimeout) {
        clearTimeout(leafletLoadTimeout)
      }
    })
    
    // Add a debugging helper for GeoJSON
    function validateGeoJson(geoJson) {
      if (!geoJson) {
        return { valid: false, message: 'GeoJSON is null or undefined' }
      }
      
      // If it's a string, try to parse it
      let parsedData = geoJson
      if (typeof geoJson === 'string') {
        try {
          parsedData = JSON.parse(geoJson)
        } catch (err) {
          return { 
            valid: false, 
            message: 'Invalid GeoJSON string: ' + err.message,
            sample: geoJson.substring(0, 100) + '...'
          }
        }
      }
      
      // Check if it's a valid GeoJSON object
      if (!parsedData.type) {
        return { valid: false, message: 'GeoJSON missing "type" property' }
      }
      
      return { valid: true, data: parsedData }
    }
    
    // Capture errors within components
    function errorCaptured(err, component, info) {
      console.error('Error in LeafletMap:', err, {
        component: component?.$options?.name || 'unknown',
        info
      })
      error.value = `Map error: ${err.message}`
      return false // prevent error propagation
    }
    
    return {
      loaded,
      error,
      leafletComponents,
      validateGeoJson,
      errorCaptured
    }
  }
}
</script>

<style>
/* Ensure the Leaflet map container takes full height */
#leaflet-container {
  min-height: 400px;
}

/* Fix the Leaflet default icon paths issue */
.leaflet-default-icon-path {
  background-image: url('https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png');
}
</style> 