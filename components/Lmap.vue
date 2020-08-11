<template>
    <div id="map-wrap" style="height: 100vh; width: 100vw">
        <client-only>
            <l-map :zoom=5 :center="center" :options="{zoomControl: false, noWrap: true}">
                <l-control-zoom position="topright"></l-control-zoom>
                <l-tile-layer :url="url"></l-tile-layer>
                <l-circle-marker
                    v-for="lmarker in markers" 
                    :key="lmarker.id"
                    :lat-lng="[lmarker.acf.coordinates.lat_coord,lmarker.acf.coordinates.lng_coord]"
                />
            </l-map>
        </client-only>
    </div>    
</template>

<script>

import axios from 'axios'

export default {
    data() {
        return {
        url: 'https://map.publictransport.is/{z}/{x}/{y}.png',
        zoom: 8,
        center: [47.313220, -1.319482]
        };
    },

    async asyncData () {
      const {data} = await axios.get('https://pt.local/wp-json/acf/v3/markers/');
      return {markers:data}
    }
/* 
    fetch({store}) {
        return axios.get('https://pt.local/wp-json/acf/v3/markers/').then((res) => {
            store.commit('myMarkers', res.data)
        }).catch((error) => {
            console.log(error)
        })
    },
    computed: {
        lmarkers() {
            return this.$store.state.lmarkers;
        }
    }, */


}
</script>

<style scoped>

</style>
