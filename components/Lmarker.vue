<template>
    <div>
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
        v-on:click="modalShow = !modalShow"
        
        >

        </l-circle-marker>

        

        <b-modal size="lg" scrollable :class="'modal modal-' + id" v-model="modalShow">

          <div slot="modal-title">
            <section class="hgroup">
                <div class="ptitle">Transport to and from</div>
                <h1>{{title}}</h1>
            </section>
          </div>




            <div class="modl-content">

              

              


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
                          {{route.destinations.start_point}} - {{route.destinations.end_point}}<span v-if="route.oneway === false"> - {{route.destinations.start_point}}</span>
                        </span>                      
                        
                      </h2>
                      <div class="provider"><span v-if="route.carferry" class="carferry">Car ferry | </span>
                        Provider: 
                          <span v-if="route.provider_url"><a :href="route.provider_url" target="_blank">{{route.provider_title}}</a></span>
                          <span v-else>{{route.provider_title}}</span>
                          
                      </div>      
                                   
                    </div>
                  
                    <b-button v-if="route.sales_url" variant="outline-primary" class="float-right" :href="route.sales_url" target="_blank">
                          Book now
                    </b-button>  
                  </div>
                </div>
              </section>
                         
            </div>

          
          <div slot="modal-footer" class="w-100">
            <b-button block variant="primary" size="lg" 
              :href="'https://publictransport.tourdesk.is/Tour/Index/1/?tag=&attraction=&sort=0&pt=undefined&dt=undefined&vendor=&onlyFavorite=false&travelmethod=&privateFilter=false&searchParameter=' 
              + title + '&region=0&durationType=0'" target="_blank">Book Tours in and Around {{title}}</b-button>
          </div>
          
        </b-modal>
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
      modalShow: false,
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
  },
}
</script>

<style lang="scss">

  body {
    position: fixed;
  }

  .button {
    color: #fff;
    text-align: center;
    border-radius: 5px;
  }

  .modal {

    .hgroup {
      padding-top: 4px;

      h1 {
        font-weight: bold;
      }
    }


    .ptitle {
      font-size: 16px;
      text-transform: uppercase;
    }
    
    .modal-dialog {

      .cta-button {
        color: #fff;
        display: block;
        font-size: 18px;
        font-weight: bold;
      }

      .routes {

        .route {

          padding-bottom: 16px;
          margin-bottom: 16px;
          border-bottom: 1px solid #ccc;
          &:last-child {
            border-bottom: none;
          }
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
            border-radius: 4px;

            .material-icons {
              margin-top: 2px;
            }
            
          }
          .routeinfo {
            display: block;
            float: left;

            .routename {
              font-size: 1.05rem;
              margin-bottom: 0.25rem;
            }

            .provider {
              font-size: 0.8rem;

              color: #656565;
              a {
                color: #656565;
              }
            }
          }
        .book-button {
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
