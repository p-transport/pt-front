<template>
    <div @keyup.esc="changeState('open')">
        <l-circle-marker 
        :title="title"
        :slug="slug"
        :lat-lng="[lat,lng]" 
        :weight="weight"
        :radius="radius" 
        :color="color" 
        :opacity="opacity"
        :fillColor="fillColor" 
        :fillOpacity="fillOpacity"
        v-on:click="infobox"
        
        >

        </l-circle-marker>

        <div v-if="state === 'open'" :class="'modal modal-' + id" @click="changeState('default')">
          <div class="modal-dialog" @click.stop="changeState('open')">
            <span @click.stop.prevent="changeState('default')" class="close"><i class="material-icons md-18">close</i></span>

            <div class="modal-content">

              

              <section class="hgroup">
                <div class="ptitle">Transport to and from</div>
                <h1>{{title}}</h1>
              </section>


              <section class="routes">
                <div class="route-section" v-for="routes in results" v-bind:key="routes.id">
                  <div class="route" v-for="route in routes" v-bind:key="route.id">
                    <span class="routeno" :style="'background-color: '+route.provider_color">
                      <i v-if="route.ferry" class="material-icons md-18">directions_boat</i>
                      <i v-else-if="route.carferry" class="material-icons md-18">directions_boat</i>
                      <i v-else-if="route.flight" class="material-icons md-18">flight</i>
                      <span v-else-if="route.number">{{route.number}}</span>
                      <i v-else class="material-icons md-18">directions_bus</i>
                    </span>
                    <div class="routeinfo">
                      <h2 class="routename">
                        <span v-if="route.provider_status == 'partner' && route.sales_url">
                          <a :href="route.sales_url" target="_blank">{{route.destinations.start_point}} - {{route.destinations.end_point}}<span v-if="route.oneway === false"> - {{route.destinations.start_point}}</span></a>
                        </span>
                        <span v-else-if="route.provider_status == 'partner' || route.provider_url">
                          <a :href="route.provider_url" target="_blank">{{route.destinations.start_point}} - {{route.destinations.end_point}}<span v-if="route.oneway === false"> - {{route.destinations.start_point}}</span></a>
                        </span>
                        <span v-else>
                          {{route.destinations.start_point}} - {{route.destinations.end_point}}<span v-if="route.oneway === false"> - {{route.destinations.start_point}}</a></span>
                        </span>                      
                        
                      </h2>
                      <div class="provider"><span v-if="route.carferry" class="carferry">Car ferry | </span>
                        Provider: 
                          <span v-if="route.provider_url"><a :href="route.provider_url" target="_blank">{{route.provider_title}}</a></span>
                          <span v-else>{{route.provider_title}}</span>
                          
                      </div>      
                                   
                    </div>
                  
                    <a v-if="route.sales_url" class="button book-button" :href="route.sales_url" target="_blank">
                          Book now
                    </a>  
                  </div>
                </div>
              </section>
              <section class="modal-footer">
                <a class="button cta-button" 
                  :href="'https://publictransport.tourdesk.is/Tour/Index/1/?tag=&attraction=&sort=0&pt=undefined&dt=undefined&vendor=&onlyFavorite=false&travelmethod=&privateFilter=false&searchParameter=' 
                  + title + '&region=0&durationType=0'" target="_blank">Book Tours in and Around {{title}}</a>
              </section>
                         
            </div>

          </div>
          
        </div>
    </div>

</template>

<script>
import axios from 'axios'


export default {
  props: {
    routes: {},
    slug: {
      type: String,
      default: ""
    },
    id: {
      type: Number,
      default: ""
    },    
    title: {
      type: String,
      default: ""
    },
    lat: {
      type: String,
      default: "47.413220"
    },
    lng: {
      type: String,
      default: "-1.219482"
    },
    weight: {
      type: Number,
      default: 5
    },
    radius: {
      type: Number,
      default: 10
    },
    color: {
      type: String,
      default: '#2F3C7E'
    },
    opacity: {
      type: Number,
      default: 0.3
    },
    fillColor: {
      type: String,
      default: '#2F3C7E'      
    },
    fillOpacity: {
      type: Number,
      default: 0.05
    }, 
  },
  
  data () {
    return {
      state: 'default',
      results: {} 
    };
  },

  mounted() {
    var self = this
    axios.get(`http://pt.local/wp-json/pt/v1/marker-routes/${this.slug}`).then((res) => {
      self.results = res.data
    })
  },
/* 
  asyncData ({ params }) {

    return axios.get(`http://pt.local/wp-json/pt/v1/marker-routes/${params.id}`)
    .then((res) => {
      console.log(res);
      return {rootes:res.data}
  
    }).catch((err) => console.log(err))

  }, */

  methods: {
    changeState: function (newState) {
      this.state = newState;
    },
    infobox: function (event) {
      // `this` inside methods points to the Vue instance
      this.changeState('open');
      // `event` is the native DOM event
    }
  },
}
</script>

<style lang="scss">

  body {
    position: fixed;
  }

  .button {
    padding: 20px;
    background-color: green;
    color: #fff;
    text-align: center;
    border-radius: 5px;
  }

  .modal {
    z-index: 1098;
    background-color: rgba(0, 0, 0, 0.25);
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    display: block;
    padding-right: 15px;
    position: fixed;
    cursor: auto;

    .modal-dialog {
      width: 640px;
      max-width: 100%;
      min-height: 200px;
      max-height: 80vh;
      background: #fff;
      margin: 0 auto;
      margin-top: 10vh;
      border: 1px solid #E1E1E1;
      box-sizing: border-box;
      box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
      border-radius: 3px;
      overflow: hidden;


      .modal-content {
        padding: 30px 30px 0;

        .hgroup {
          margin-bottom: 16px;
        }

        h1 {
          font-size: 24px;
        }

        .ptitle {
          font-size: 16px;
          text-transform: uppercase;
        }

      }

      .modal-footer {
        padding: 30px;
        box-shadow: 0px -4px 4px rgba(0, 0, 0, 0.25);
      }

      .cta-button {
        color: #fff;
        display: block;
        font-size: 18px;
        font-weight: bold;
        text-decoration: none;
        margin: 0 auto;
      }

      .routes {
        overflow-y: scroll;
        overflow-x: auto;
        max-height: 330px;

        .route {

          padding-bottom: 16px;
          margin-bottom: 16px;
          border-bottom: 1px solid #ccc;
          &:after {
            content: "";
            display: table;
            clear: both;
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
            margin-right: 10px;
            clear: both;
            min-width: 40px;
            height: 36px;
            margin-top: 5px;
            border-radius: 4px;

            .material-icons {
              margin-top: 2px;
            }
            
          }
          .routeinfo {
            display: block;
            float: left;
            .provider {
              color: #656565;
              a {
                color: #656565;
              }
            }
          }
        .book-button {
          width: 100px;
          float: right;
          padding: 10px;
          background-color: #fff;
          text-transform: uppercase;
          border: 1px solid #000;
          color: #000;
          text-decoration: none;
          border-radius: 3px;
        }
        }
      }

      .close {
        float: right;
        padding: 10px;
        cursor: pointer;
        color: #999;
      }

    }
  }



</style>
