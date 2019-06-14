<template>
  <div>
    <b-navbar type="dark">
      <b-navbar-brand href="#">Public Transport Iceland</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        
        <b-navbar-nav class="ml-auto">
          <b-nav-item href="#">About</b-nav-item>
          <b-nav-item target="_blank" href="https://cyclingiceland.is/wp-content/uploads/2019/04/PT-2019-enska-vefsidur-mai-2019-.pdf">Download PDF</b-nav-item>
        </b-navbar-nav>

      </b-collapse>

    </b-navbar>

    <b-container class="flex-grow-1" fluid>
      <b-row>

          <div id="map-wrap">
              <no-ssr>
                  <l-map :zoom="zoom" :minZoom="2" :center="center"  :options="{zoomControl: false, attributionControl: false}">
                      <l-control-zoom position="topright"></l-control-zoom>
                      <l-tile-layer :url="url"  :noWrap=true></l-tile-layer>
                      <Lmarker
                          v-for="lmarker in markers" 
                          :key="lmarker.id"
                          :slug="lmarker.slug"
                          :lat="lmarker.coordinates.lat_coord"
                          :lng="lmarker.coordinates.long_coord"
                          :id="lmarker.id"
                          :title="lmarker.title"
                          :routes="lmarker.routes"
                      />
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

export default {
    data() {
        return {
        url: 'https://map.publictransport.is/{z}/{x}/{y}.png',
        zoom: 2,
        center: [47.313220, -1.319482]
        };
    },
    async asyncData () {
      const {data} = await axios.get('http://pt.local/wp-json/pt/v1/markers');
      return {markers:data}
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

  .navbar {
    background-color: #A10B0B;
    
    .navbar-brand {
      font-weight: bold;
    }
  }

</style>
