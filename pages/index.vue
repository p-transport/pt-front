<template>
  <div>

    <b-container class="flex-grow-1" fluid>
      <b-row>

          <div id="map-wrap">
              <no-ssr>
                  <l-map :zoom="zoom" :minZoom="2" :center="center"  :options="{zoomControl: false, attributionControl: false}">
                      <l-control-zoom position="topright"></l-control-zoom>
                      <l-tile-layer :url="url"  :noWrap=true></l-tile-layer>
                      <Lmarker v-for="lmarker in markers" :key="lmarker.id"
                        :slug="lmarker.slug"
                        :lat="lmarker.coordinates.lat_coord"
                        :lng="lmarker.coordinates.long_coord"
                        :id="lmarker.id"
                        :title="lmarker.title"
                        :routes="lmarker.routes"
                        :salesUrl="lmarker.sales_url"
                        
                      />
                      <l-control-attribution position="bottomright" prefix="&copy; 2019 Cartography: Hugarflug ehf / Ingi Gunnar Jóhannsson. Published by <a href='https://www.hjolafaerni.is'>Hjólafærni á Íslandi</a> – All rights reserved" >
                      Gl
                      </l-control-attribution>
                  </l-map>
              </no-ssr>
          </div>    
  
      </b-row>
    </b-container>    
  </div>


</template>

<script>

import axios from 'axios'
import Lmarker from '~/components/Lmarker.vue'
import  VueAnalytics from 'vue-analytics'

export default {
    data() {
        return {
        url: 'https://map.publictransport.is/{z}/{x}/{y}.png',
        zoom: 2,
        center: [47.313220, -1.319482]
        };
    },
    async asyncData () {
      const {data} = await axios.get('http://wp.publictransport.is/wp-json/pt/v1/markers');
      return {markers:data}
    },
    methods: {
      gaEvent: function(cat,act,lab) {
        this.$ga.event({
          eventCategory: cat,
          eventAction: act,
          eventLabel: lab,
        });
        console.log('log')
      }  
    },
    components: {
      Lmarker
    }

}

</script>

<style lang="scss">
  * {
    font-family: Roboto, sans-serif;
    box-sizing: border-box;
  }

  #map-wrap {

    height: 93vh;
    width: 100vw;
  }
  .leaflet-container.leaflet-container {
    background-color: #E3E3E3;
  }

</style>
