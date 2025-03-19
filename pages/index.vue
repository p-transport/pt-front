<template>
    <div>
      <b-container fluid class="pl-0 pr-0">

          <b-col sm="12" class="px-0">
            <div id="map-wrap">
                <client-only>
                    <l-map :zoom="zoom" :minZoom="2" :center="center" :bounds="bounds" :options="{zoomControl: false, attributionControl: false, zoomSnap: 0.1}">
                        <l-control-zoom position="topright"></l-control-zoom>

                        <l-image-overlay url="https://publictransport.is/pt20240711_en.svg" :bounds="bounds" :center="center"></l-image-overlay>

<!--                         <Lmarker v-for="lmarker in markers" :key="lmarker.id"
                          :slug="lmarker.slug"
                          :swlat="lmarker.coordinates.lat_coord"
                          :swlng="lmarker.coordinates.long_coord"
                          :nelat="lmarker.coordinates.lat_coord_ne"
                          :nelng="lmarker.coordinates.long_coord_ne"
                          :polygon="lmarker.polygon"
                          :id="lmarker.id"
                          :title="lmarker.title"
                          :routes="lmarker.routes"
                          :salesUrl="lmarker.sales_url"
                        /> -->

<!--                         <Lpolymarker v-for="lmarker in markers" :key="lmarker.id"
                          :slug="lmarker.slug"
                          :latlngs="lmarker.geojson.geometry.coordinates"
                          :id="lmarker.id"
                          :title="lmarker.title"
                          :routes="lmarker.routes"
                          :salesUrl="lmarker.sales_url"                        
                        /> -->

                        <lpolymarker v-for="lmarker in markers" :key="lmarker.id"
                          :id="lmarker.id"
                          :slug="lmarker.slug"
                          :title="lmarker.title"
                          :routes="lmarker.routes"
                          :salesUrl="lmarker.sales_url"
                          :geojson="parsedGeoJson(lmarker.geojson)"
                        >
                        </lpolymarker>


                        
                        <l-control-attribution position="bottomright" prefix="&copy; 2023 Cartography: Hugarflug ehf / Ingi Gunnar Jóhannsson. Published by <a href='https://www.hjolafaerni.is'>Hjólafærni á Íslandi</a> – All rights reserved" >
                        Gl
                        </l-control-attribution>
                    </l-map>
                </client-only>
            </div>    
          </b-col>


      </b-container>

    </div>

</template>

<script>

import axios from 'axios'
import Lmarker from '~/components/Lmarker.vue'
import Lpolymarker from '~/components/Lpolymarker.vue'
import  VueAnalytics from 'vue-analytics'

export default {
    data() {
        return {
        url: 'https://map.publictransport.is/2022/{z}/{x}/{y}.png',
        zoom: 2,
        center: [47.313220, -1.319482],
        bounds: [[83.287664, -159.522857], 
                [-44.391598, 149.762878]]
        }
    },
    async asyncData () {
      const {data} = await axios.get('https://wp.publictransport.is/wp-json/pt/v1/markers');
      return {markers:data}
    },
    methods: {
      gaEvent: function(cat,act,lab) {
        this.$ga.event({
          eventCategory: cat,
          eventAction: act,
          eventLabel: lab,
        });
      },
      parsedGeoJson: function (geojson) {
        if (geojson) {
          return JSON.parse(geojson)
        }
      }
    },
    computed: {
    },
    components: {
      Lmarker,
      Lpolymarker
    }
}

</script>

<style lang="scss">
  * {
    font-family: Inter, sans-serif;
    box-sizing: border-box;
  }

  #map-wrap {
    height: 100vh;
    overflow: hidden;
  }
  .leaflet-container.leaflet-container {
    background-color: #E3E3E3;
  }

  .leaflet-top.leaflet-top {
    top: 56px;
  }

  .provider-color {
    width: 20%;
    height: 3px;
    background-color: #009de0;
    display: block;
    border-radius: 1.5px;
  }

</style>
