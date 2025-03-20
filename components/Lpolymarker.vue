<template>
    <div>
        <slot v-if="!leafletLoaded" name="loading"></slot>
        <ClientOnly>
            <template v-if="safeGeoJson">
                <component :is="getLeafletComponent('LGeoJson')"
                  :geojson="safeGeoJson"
                  :options-style="styleFunction"
                  @click="markerClick('Marker','Click',title)"
                />         
            </template>
            <template v-else>
                <!-- Fallback to a circle marker if no GeoJSON is available -->
                <component :is="getLeafletComponent('LCircleMarker')" 
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
            <div v-if="modalShow" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50" @click.self="modalShow = false">
              <div class="relative w-full max-w-4xl bg-white rounded-lg shadow-xl flex flex-col max-h-[90vh] min-h-[50vh]">
                <!-- Modal header -->
                <div class="p-4 border-b shrink-0">
                  <div class="hgroup">
                    <div class="ptitle text-gray-600">Transport to and from</div>
                    <h1 class="text-2xl font-bold">{{ title }}</h1>
                  </div>
                  <button class="absolute top-4 right-4 text-gray-400 hover:text-gray-600" @click="modalShow = false">
                    <span class="material-icons">close</span>
                  </button>
                </div>

                <!-- Modal body - now scrollable -->
                <div class="p-6 overflow-y-auto flex-grow">
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
                                    <span v-else-if="route.number">{{ route.number }}</span>
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
                                      <a href="https://wp.publictransport.is/wp-content/uploads/latest_en.pdf" target="_blank">{{ route.provider_title }} (PDF)</a>
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
                                 class="inline-block w-full sm:w-auto px-4 py-2 text-center border border-primary text-primary rounded hover:bg-primary hover:text-white transition-colors">
                                 Book now
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>

                <!-- Modal footer - now fixed at bottom -->
                <div v-if="salesUrl" class="p-4 border-t mt-auto shrink-0">
                  <a @click="trackSalesClick('Main sales link', title, salesUrl)"
                     :href="salesUrl"
                     target="_blank"
                     class="block w-full py-3 text-center bg-primary text-white rounded font-bold hover:bg-blue-600 transition-colors">
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
import { ref, computed, onMounted, watch, inject, shallowRef, markRaw } from 'vue'
import { useNuxtApp } from '#app'

export default {
  name: 'Lpolymarker',
  components: {},
  
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
    debugMode: {
      type: Boolean,
      default: false
    }
  },
  
  setup(props) {
    const fillColor = ref(props.color || "#000")
    const modalShow = ref(false)
    const results = ref({})
    const safeGeoJson = shallowRef(null)
    const leafletLoaded = ref(false)
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
    
    // Function to get the right Leaflet component
    function getLeafletComponent(name) {
      if (typeof window === 'undefined') {
        return null;
      }
      
      try {
        if (window.__vueLeafletComponents && window.__vueLeafletComponents[name]) {
          return markRaw(window.__vueLeafletComponents[name]);
        }
        
        // Try to load the components if Leaflet is available but components aren't
        if (window.L && (!window.__vueLeafletComponents || !window.__vueLeafletComponents[name])) {
          // We'll dynamically import, but this won't be available immediately
          setTimeout(() => {
            import('@vue-leaflet/vue-leaflet').then(module => {
              if (!window.__vueLeafletComponents) {
                window.__vueLeafletComponents = {};
              }
              window.__vueLeafletComponents[name] = markRaw(module[name]);
              // This will cause a re-render
              leafletLoaded.value = true;
            }).catch(e => {
              console.error(`Failed to load ${name} component:`, e);
            });
          }, 0);
        }
      } catch (e) {
        console.error('Error getting Leaflet component:', e);
      }
      
      return null;
    }

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

    onMounted(async () => {
      // Initialize leafletLoaded as false until we confirm components are available
      leafletLoaded.value = false;
      
      // Configure global leaflet components container
      if (typeof window !== 'undefined') {
        if (!window.__vueLeafletComponents) {
          window.__vueLeafletComponents = {};
        }
        
        // Check if Leaflet is available
        if (window.L) {
          try {
            const module = await import('@vue-leaflet/vue-leaflet');
            window.__vueLeafletComponents.LGeoJson = markRaw(module.LGeoJson);
            window.__vueLeafletComponents.LCircleMarker = markRaw(module.LCircleMarker);
            leafletLoaded.value = true;
          } catch (err) {
            console.error('Error loading vue-leaflet components:', err);
          }
        } else {
          // Set up a watcher to check for Leaflet availability
          const checkLeaflet = setInterval(() => {
            if (window.L) {
              clearInterval(checkLeaflet);
              import('@vue-leaflet/vue-leaflet').then(module => {
                window.__vueLeafletComponents.LGeoJson = markRaw(module.LGeoJson);
                window.__vueLeafletComponents.LCircleMarker = markRaw(module.LCircleMarker);
                leafletLoaded.value = true;
              }).catch(err => {
                console.error('Error loading vue-leaflet components:', err);
              });
            }
          }, 200);
          
          // Clear the interval after 10 seconds to prevent memory leaks
          setTimeout(() => {
            clearInterval(checkLeaflet);
          }, 10000);
        }
      }
      
      try {
        const { data } = await axios.get(`https://wp.publictransport.is/wp-json/pt/v1/marker-routes/${props.slug}`);
        results.value = data;
        
        // Process GeoJSON again after mounting
        processSafeGeoJson(props.geojson);
      } catch (error) {
        console.error('Error fetching marker routes:', error, {
          title: props.title,
          slug: props.slug
        });
      }
    })

    function markerClick(at, act, lab) {
      modalShow.value = !modalShow.value
      
      // Get the $gtag function from the Nuxt instance
      const { $gtag } = useNuxtApp()
      
      // Track marker click event
      if ($gtag && modalShow.value) {
        $gtag('marker_click', 'click', {
          marker_title: props.title,
          marker_id: props.id,
          marker_slug: props.slug,
          location: `${props.lat},${props.lng}`
        })
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
      return markRaw(() => {
        return {
          weight: props.weight || 2,
          color: props.color || "#ECEFF1",
          opacity: props.debugMode ? (props.opacity || 0.8) : 0,
          fillColor: props.color || "#0000ff",
          fillOpacity: props.debugMode ? (props.fillOpacity || 0.5) : 0
        }
      })
    })
    
    return {
      fillColor,
      modalShow,
      results,
      markerClick,
      styleFunction,
      safeGeoJson,
      leafletLoaded,
      getLeafletComponent,
      markerPosition,
      trackSalesClick
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
  border-radius: 4px;
}

.routeno .material-icons {
  margin-top: 2px;
}

.routeinfo .routename {
  font-size: 1.05rem;
  margin-bottom: 0.25rem;
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
  border-bottom: 1px solid #dee2e6;
}

.hgroup {
  padding-top: 4px;
}

.hgroup h1 {
  font-weight: bold;
}

.ptitle {
  font-size: 16px;
  text-transform: uppercase;
}
</style>
