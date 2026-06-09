<template>
    <div>
        <ClientOnly>
            <template v-if="safeGeoJson">
                <LGeoJson
                  :geojson="safeGeoJson"
                  :options-style="styleFunction"
                  @click="markerClick('Marker','Click',title)"
                  @ready="onLayerReady"
                />
            </template>
            <template v-else>
                <!-- Fallback to a circle marker if no GeoJSON is available -->
                <LCircleMarker
                  :lat-lng="markerPosition"
                  :radius="radius"
                  :weight="weight"
                  :color="color"
                  :opacity="0.8"
                  :fillColor="color"
                  :fillOpacity="0.5"
                  @click="markerClick('Marker','Click',title)"
                />
            </template>
        </ClientOnly>
        
        <ClientOnly>
          <!-- Using a custom modal in Tailwind instead of b-modal -->
          <Teleport to="body">
            <div v-if="modalShow" class="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay" @click.self="modalShow = false">
              <div class="modal relative w-full max-w-4xl flex flex-col max-h-[70vh] md:max-h-[90vh] min-h-[60vh] overflow-hidden modal-glass">
                <!-- Modal header -->
                <div class="absolute top-0 left-0 right-0 px-6 pt-5 pb-10 modal-header-fade rounded-t-[2rem] z-10 pointer-events-none">
                  <div class="hgroup">
                    <div class="ptitle">Transport to and from</div>
                    <h1 class="text-2xl font-bold text-gray-900">{{ title }}</h1>
                  </div>
                  <button class="absolute top-5 right-5 w-11 h-11 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors modal-close-btn pointer-events-auto" @click="modalShow = false">
                    <span class="material-icons" style="font-size: 26px;">close</span>
                  </button>
                </div>

                <!-- Modal body - now scrollable -->
                <div v-if="loading" class="p-6 flex-grow flex items-center justify-center">
                  <div class="text-center">
                    <div class="animate-pulse bg-black/10 rounded-full h-2.5 w-24 mx-auto mb-3"></div>
                    <div class="text-sm text-gray-500">Loading routes…</div>
                  </div>
                </div>
                <div v-else-if="loadError" class="p-6 py-8 text-center text-sm text-red-600">
                  {{ loadError }}
                </div>
                <div v-else-if="hasResults" class="px-8 pt-28 pb-8 overflow-y-auto flex-grow modal-scroll" :class="{ 'pb-24': salesUrl }">
                  <section>
                    <div v-for="routes in results" :key="routes.id">
                      <div v-for="route in routes" :key="route.id" class="route">
                        <div class="routeinfo">
                          <div class="flex flex-col sm:flex-row sm:items-center">
                            <div class="flex-grow">
                              <div class="flex items-start">
                                <div class="mr-3">
                                  <span class="routeno" :style="'background-color: '+route.provider_color">
                                    <i v-if="route.ferry" class="material-icons md-18">directions_boat</i>
                                    <i v-else-if="route.carferry" class="material-icons md-18">directions_boat</i>
                                    <i v-else-if="route.flight" class="material-icons md-18">flight</i>
                                    <span v-else-if="route.number" :style="typeof route.number === 'string' && route.number.length === 3 ? { fontSize: '14px' } : null">{{ route.number }}</span>
                                    <i v-else class="material-icons md-18">directions_bus</i>
                                  </span>
                                </div>
                                <div>
                                  <h2 class="routename">
                                    <template v-if="route.provider_status === 'partner' && route.sales_url">
                                      <a :href="route.sales_url"
                                         @click="trackSalesClick('Route name', route.number, route.sales_url)"
                                         target="_blank"
                                         class="hover:text-primary">
                                        {{ route.destinations.start_point }} - {{ route.destinations.end_point }}
                                        <span v-if="route.oneway === false"> - {{ route.destinations.start_point }}</span>
                                      </a>
                                    </template>
                                    <template v-else-if="route.provider_status === 'partner' || route.provider_url">
                                      <a :href="route.provider_url"
                                         @click="trackSalesClick('Provider link', route.provider_title, route.provider_url)"
                                         target="_blank"
                                         class="hover:text-primary">
                                        {{ route.destinations.start_point }} - {{ route.destinations.end_point }}
                                        <span v-if="route.oneway === false"> - {{ route.destinations.start_point }}</span>
                                      </a>
                                    </template>
                                    <template v-else>
                                      {{ route.destinations.start_point }} - {{ route.destinations.end_point }}
                                      <span v-if="route.oneway === false"> - {{ route.destinations.start_point }}</span>
                                    </template>
                                  </h2>
                                  <div class="provider">
                                    <span v-if="route.carferry" class="carferry">Car ferry | </span>
                                    <template v-if="route.provider_url">
                                      <a :href="route.provider_url" target="_blank">{{ route.provider_title }}</a>
                                    </template>
                                    <template v-else>
                                      <a v-if="operatorMapUrl" :href="operatorMapUrl" target="_blank">{{ route.provider_title }} (PDF)</a>
                                      <span v-else>{{ route.provider_title }}</span>
                                    </template>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div class="mt-3 sm:mt-0">
                              <a v-if="route.sales_url"
                                 @click="trackSalesClick('Book now', route.number, route.sales_url)"
                                 :href="route.sales_url"
                                 target="_blank"
                                 class="inline-block w-full sm:w-auto px-4 py-2 text-center bg-[#0066cc] text-white rounded-full text-sm font-semibold hover:bg-[#004f99] transition-colors">
                                 Book now
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
                <!-- Alternative body when no results are found -->
                <div v-else-if="salesUrl" class="p-6 flex-grow flex flex-col items-center justify-center text-center">
                   <h2 class="text-xl text-gray-600 mb-4">No public transport routes found for {{ title }}.</h2>
                   <p class="mb-6 text-gray-500">However, you can still book tours and activities!</p>
                   <a @click="trackSalesClick('Main sales link (No Results)', title, salesUrl)"
                      :href="salesUrl"
                      target="_blank"
                      class="inline-block px-8 py-4 bg-[#0066cc] text-white rounded-full font-bold text-lg hover:bg-[#004f99] transition-colors">
                      Book Tours in and Around {{ title }}
                   </a>
                </div>
                <!-- Fallback if no results and no sales URL -->
                <div v-else class="p-6 flex-grow flex items-center justify-center text-center">
                   <p class="text-gray-500">No transport routes or booking links available for {{ title }}.</p>
                </div>

                <!-- Modal footer - floats over content at the bottom -->
                <div v-if="hasResults && salesUrl" class="absolute bottom-0 left-0 right-0 px-6 pb-5 pt-10 modal-footer-fade rounded-b-[2rem] pointer-events-none">
                  <a @click="trackSalesClick('Main sales link', title, salesUrl)"
                     :href="salesUrl"
                     target="_blank"
                     class="block w-full py-3 text-center bg-[#0066cc] text-white rounded-full font-bold hover:bg-[#004f99] transition-colors pointer-events-auto">
                     Book Tours in and Around {{ title }}
                  </a>
                </div>
              </div>
            </div>
          </Teleport>
        </ClientOnly>
    </div>
</template>

<script>
import axios from 'axios'
import { ref, computed, watch, shallowRef, markRaw } from 'vue'
import { useNuxtApp } from '#app'
import { LGeoJson, LCircleMarker } from '@vue-leaflet/vue-leaflet'

export default {
  name: 'Lpolymarker',
  components: {
    LGeoJson,
    LCircleMarker
  },
  
  props: {
    slug: {
      type: String,
      default: ""
    },
    id: {
      type: Number,
      default: 0
    },    
    title: {
      type: String,
      default: ""
    },
    lat: {
      type: String,
      default: ""
    },
    lng: {
      type: String,
      default: ""
    },
    geojson: {
      type: [Object, String],
      default: null
    },
    weight: {
      type: Number,
      default: 2
    },
    radius: {
      type: Number,
      default: 10
    },
    color: {
      type: String,
      default: '#ff0000'
    },
    opacity: {
      type: Number,
      default: 0
    },
    fillOpacity: {
      type: Number,
      default: 0.2
    }, 
    salesUrl: String,
    operatorMapUrl: {
      type: String,
      default: ''
    },
    debugMode: {
      type: Boolean,
      default: false
    },
    introDelay: {
      type: Number,
      default: 0.5
    }
  },
  
  setup(props) {
    const fillColor = ref(props.color || "#000")
    const modalShow = ref(false)
    const results = ref({})
    const loading = ref(false)
    const loadError = ref(null)
    const routesFetched = ref(false)
    const safeGeoJson = shallowRef(null)

    const hasResults = computed(() => {
      if (!results.value || typeof results.value !== 'object' || Object.keys(results.value).length === 0) {
        return false;
      }
      return Object.values(results.value).some(arr => Array.isArray(arr) && arr.length > 0);
    });


    const markerPosition = computed(() => {
      // Try to get position from GeoJSON first
      if (safeGeoJson.value && safeGeoJson.value.geometry) {
        const geo = safeGeoJson.value.geometry;
        
        // For Point geometries
        if (geo.type === 'Point' && Array.isArray(geo.coordinates) && geo.coordinates.length >= 2) {
          // GeoJSON uses [lng, lat] format, but Leaflet uses [lat, lng]
          return [geo.coordinates[1], geo.coordinates[0]];
        }
        
        // For other geometries, try to get a centroid or first coordinate
        if ((geo.type === 'Polygon' || geo.type === 'MultiPolygon' || 
            geo.type === 'LineString' || geo.type === 'MultiLineString') && 
            geo.coordinates && geo.coordinates.length) {
          
          // Simple case: just use the first coordinate of the first shape
          // For complex cases, a proper centroid calculation would be better
          let coords;
          if (geo.type === 'Polygon' || geo.type === 'LineString') {
            coords = geo.coordinates[0];
          } else if (geo.type === 'MultiPolygon') {
            coords = geo.coordinates[0][0];
          } else { // MultiLineString
            coords = geo.coordinates[0];
          }
          
          if (Array.isArray(coords) && coords.length >= 2) {
            return [coords[1], coords[0]]; // Convert from [lng, lat] to [lat, lng]
          }
        }
      }
      
      // Fall back to props if provided
      if (props.lat && props.lng) {
        return [parseFloat(props.lat), parseFloat(props.lng)];
      }
      
      // Default to Reykjavik coordinates if nothing else works
      return [64.1466, -21.9426];
    });
    
    // Process GeoJSON when the component is mounted or when the prop changes
    watch(() => props.geojson, (newGeoJson) => {
      processSafeGeoJson(newGeoJson)
    }, { immediate: true })

    // Function to process GeoJSON safely
    function processSafeGeoJson(data) {
      try {
        if (!data) {
          safeGeoJson.value = null
          return
        }

        if (typeof data === 'string') {
          // Use markRaw to prevent reactivity on GeoJSON object
          safeGeoJson.value = markRaw(JSON.parse(data))
        } else {
          // Use markRaw to prevent reactivity on GeoJSON object
          safeGeoJson.value = markRaw(data)
        }
      } catch (error) {
        console.error('Error processing GeoJSON:', error, {
          title: props.title,
          slug: props.slug
        })
        safeGeoJson.value = null
      }
    }

    async function fetchRoutes() {
      if (routesFetched.value || loading.value) return
      loading.value = true
      loadError.value = null
      try {
        const { data } = await axios.get(`https://wp.publictransport.is/wp-json/pt/v1/marker-routes/${props.slug}`)
        results.value = data
        routesFetched.value = true
      } catch (error) {
        console.error('Error fetching marker routes:', error, {
          title: props.title,
          slug: props.slug
        })
        loadError.value = 'Could not load routes. Please try again.'
      } finally {
        loading.value = false
      }
    }

    function markerClick(at, act, lab) {
      modalShow.value = !modalShow.value

      if (modalShow.value) {
        fetchRoutes()

        // Get the $gtag function from the Nuxt instance
        const { $gtag } = useNuxtApp()

        // Track marker click event
        if ($gtag) {
          $gtag('marker_click', 'click', {
            marker_title: props.title,
            marker_id: props.id,
            marker_slug: props.slug,
            location: `${props.lat},${props.lng}`
          })
        }
      }
    }

    function trackSalesClick(type, label, url) {
      // Get the $gtag function from the Nuxt instance
      const { $gtag } = useNuxtApp()
      
      // Track sales link click
      if ($gtag) {
        $gtag('sales_click', type, {
          label: label,
          url: url,
          marker_title: props.title,
          marker_id: props.id
        })
      }
    }

    // Use markRaw for the style function to prevent reactivity issues
    const styleFunction = computed(() => {
      return markRaw(() => ({
        weight: props.weight || 2,
        color: props.color || "#ECEFF1",
        opacity: props.debugMode ? (props.opacity || 0.8) : 0,
        fillColor: props.color || "#0000ff",
        fillOpacity: props.debugMode ? (props.fillOpacity || 0.5) : 0,
        className: '' // animation class applied to <g> wrapper in onLayerReady
      }))
    })

    // Spacey hue palette mapped across the NW→SE delay range (0.2s–2.2s)
    const hueStops = [268, 275, 260, 280, 255, 270, 262, 272]
    function delayToHue(delay) {
      const t = Math.max(0, Math.min(1, delay / 0.2))
      const idx = t * (hueStops.length - 1)
      const lo = Math.floor(idx)
      const hi = Math.min(hueStops.length - 1, lo + 1)
      return Math.round(hueStops[lo] + (hueStops[hi] - hueStops[lo]) * (idx - lo))
    }

    function onLayerReady(layer) {
      if (props.debugMode) return
      const delay = props.introDelay ?? 0.5
      const hue = delayToHue(delay)
      const ns = 'http://www.w3.org/2000/svg'
      const allAnims = []

      layer.eachLayer(l => {
        const el = l.getElement?.()
        if (!el?.parentNode) return

        const svg = el.closest('svg')
        if (!svg) return

        // Ensure <defs> exists in the Leaflet SVG
        let defs = svg.querySelector('defs')
        if (!defs) {
          defs = document.createElementNS(ns, 'defs')
          svg.insertBefore(defs, svg.firstChild)
        }

        // SVG filter with explicit large region — prevents Safari from clipping blur to bbox
        const fid = `pf-${props.slug}`
        if (!defs.querySelector(`#${fid}`)) {
          const filter = document.createElementNS(ns, 'filter')
          filter.id = fid
          filter.setAttribute('x', '-100%')
          filter.setAttribute('y', '-100%')
          filter.setAttribute('width', '300%')
          filter.setAttribute('height', '300%')
          const feBlur = document.createElementNS(ns, 'feGaussianBlur')
          feBlur.setAttribute('in', 'SourceGraphic')
          feBlur.setAttribute('stdDeviation', '40')
          const blurAnim = document.createElementNS(ns, 'animate')
          blurAnim.setAttribute('attributeName', 'stdDeviation')
          blurAnim.setAttribute('values', '40;22;16;16;30;44')
          blurAnim.setAttribute('keyTimes', '0;0.2;0.4;0.58;0.78;1')
          blurAnim.setAttribute('dur', '1.8s')
          blurAnim.setAttribute('begin', 'indefinite')
          blurAnim.setAttribute('fill', 'freeze')
          blurAnim.setAttribute('calcMode', 'spline')
          blurAnim.setAttribute('keySplines', '0.45 0 0.55 1;0.45 0 0.55 1;0.45 0 0.55 1;0.45 0 0.55 1;0.45 0 0.55 1')
          feBlur.appendChild(blurAnim)
          filter.appendChild(feBlur)
          defs.appendChild(filter)
          allAnims.push(blurAnim)
        }

        // Wrap path in <g>, apply SVG filter; start invisible so no flash before SMIL fires
        const g = document.createElementNS(ns, 'g')
        el.parentNode.insertBefore(g, el)
        g.appendChild(el)
        g.setAttribute('filter', `url(#${fid})`)
        g.setAttribute('opacity', '0')

        // SMIL opacity animation on the group
        const opacAnim = document.createElementNS(ns, 'animate')
        opacAnim.setAttribute('attributeName', 'opacity')
        opacAnim.setAttribute('values', '0;0.55;0.9;0.82;0.28;0')
        opacAnim.setAttribute('keyTimes', '0;0.2;0.4;0.58;0.78;1')
        opacAnim.setAttribute('dur', '1.8s')
        opacAnim.setAttribute('begin', 'indefinite')
        opacAnim.setAttribute('fill', 'freeze')
        opacAnim.setAttribute('calcMode', 'spline')
        opacAnim.setAttribute('keySplines', '0.45 0 0.55 1;0.45 0 0.55 1;0.45 0 0.55 1;0.45 0 0.55 1;0.45 0 0.55 1')
        g.appendChild(opacAnim)
        allAnims.push(opacAnim)

        // Set fill via inline style — overrides Leaflet's SVG presentation attributes
        el.style.fill = `hsl(${hue}, 80%, 52%)`
        el.style.fillOpacity = '0.75'
        el.style.strokeWidth = '0'
      })

      // Trigger all SMIL animations after the stagger delay
      setTimeout(() => {
        allAnims.forEach(a => { try { a.beginElement() } catch (e) {} })
      }, delay * 1000)
    }
    
    return {
      fillColor,
      modalShow,
      results,
      loading,
      loadError,
      markerClick,
      styleFunction,
      onLayerReady,
      safeGeoJson,
      markerPosition,
      trackSalesClick,
      hasResults
    }
  },
  
  // Add error handling for geojson
  errorCaptured(err, component, info) {
    console.error('Error in Lpolymarker component:', err, {
      component: component?.$options?.name || 'unknown',
      info,
      title: this.title,
      slug: this.slug
    })
    return false // prevent propagation
  }
}
</script>

<style>
/* Polygon intro animation — SMIL-driven (blur + opacity) for correct Safari blur edges.
   Fill, stroke, and filter are applied via JS in onLayerReady. */

/* Allow blur to spill outside the SVG viewport in Safari */
.leaflet-overlay-pane svg,
.leaflet-overlay-pane svg g {
  overflow: visible;
}

/* Overlay */
.modal-overlay {
  background-color: rgba(255, 255, 255, 0.4);
  -webkit-backdrop-filter: blur(8px);
  backdrop-filter: blur(8px);
}

/* Glass card */
.modal-glass {
  background-color: rgba(255, 255, 255, 0.55);
  -webkit-backdrop-filter: blur(18px) saturate(150%);
  backdrop-filter: blur(18px) saturate(150%);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 2rem;
}

/* Floating header fade */
.modal-header-fade {
  background: linear-gradient(to top, rgba(255,255,255,0) 0%, rgba(255,255,255,0.85) 40%, rgba(255,255,255,0.95) 100%);
}

/* Floating footer fade */
.modal-footer-fade {
  background: linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.85) 40%, rgba(255,255,255,0.95) 100%);
}

/* Close button */
.modal-close-btn:hover {
  background-color: rgba(0, 0, 0, 0.06);
}

.routeno {
  display: block;
  float: left;
  padding: 4px;
  background-color: black;
  color: #fff;
  font-size: 18px;
  text-align: center;
  font-weight: 700;
  width: 40px;
  min-width: 40px;
  height: 36px;
  border-radius: 0.5rem;
}

.routeno .material-icons {
  margin-top: 2px;
}

.routeinfo .routename {
  font-size: 1.05rem;
  margin-bottom: 0.25rem;
  color: #111827;
}

.routeinfo .provider {
  font-size: 0.8rem;
  color: #656565;
}

.routeinfo .provider a {
  color: #656565;
}

.route {
  padding-bottom: 16px;
  margin-bottom: 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.07);
}

.hgroup {
  padding-top: 4px;
}

.hgroup h1 {
  font-weight: bold;
  color: #111827;
}

.ptitle {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #9ca3af;
}

/* Modal mobile styles */
@media (max-width: 640px) {
  .modal .routeinfo .routename {
    font-size: 0.95rem;
  }

  .modal .p-6 {
    padding: 1rem;
  }

  .modal a.inline-block {
    margin-top: 0.5rem;
    width: 100%;
    padding: 0.5rem;
    text-align: center;
  }

  .modal .flex-col {
    display: flex;
    flex-direction: column;
  }
}

/* Subtle scrollbar matching the glass aesthetic */
.modal-scroll::-webkit-scrollbar {
  width: 4px;
}

.modal-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.modal-scroll::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.15);
  border-radius: 2px;
}

.modal-scroll::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.25);
}
</style>
