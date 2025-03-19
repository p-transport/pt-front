<template>
    <div>
<!--          <l-polygon 
        :title="title"
        :slug="slug"
        :latLngs="latLngs" 
        :weight="weight"
        :radius="radius" 
        :color="color" 
        :opacity="opacity"
        :fillColor="fillColor" 
        :fillOpacity="fillOpacity"
        :salesUrl="salesUrl"
        @click="markerClick('Marker','Click',title)"

        >
        </l-polygon>  -->

        <template v-if="geojson">
          <l-geo-json
            :geojson="geojson"
            :options-style="styleFunction"
            @click="markerClick('Marker','Click',title)"
          >
          </l-geo-json>          
        </template>
        <template v-else>
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
          :salesUrl="salesUrl"
          @click="markerClick('Marker','Click',title)"
          >

          </l-circle-marker>
        </template>



        
        <client-only>

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
                      <div class="routeinfo">
                        <b-container fluid class="pl-0 pr-0">
                          <b-row>
                            <b-col sm="8">
                              <b-media no-body>
                                <b-media-aside class="mr-2">
                                  <span slot="aside" class="routeno" :style="'background-color: '+route.provider_color">
                                    <i v-if="route.ferry" class="material-icons md-18">directions_boat</i>
                                    <i v-else-if="route.carferry" class="material-icons md-18">directions_boat</i>
                                    <i v-else-if="route.flight" class="material-icons md-18">flight</i>
                                    <span slot="aside" v-else-if="route.number">{{route.number}}</span>
                                    <i v-else class="material-icons md-18">directions_bus</i>
                                  </span>
                                </b-media-aside>
                                <b-media-body>
                                  <h2 class="routename">
                                    <template v-if="route.provider_status == 'partner' && route.sales_url">
                                      <a :href="route.sales_url" @click="markerClick('Sales link','Route name',route.number + ' ' + route.sales_url)" target="_blank">{{route.destinations.start_point}} - {{route.destinations.end_point}}<span v-if="route.oneway === false"> - {{route.destinations.start_point}}</span></a>
                                    </template>
                                    <template v-else-if="route.provider_status == 'partner' || route.provider_url">
                                      <a :href="route.provider_url" @click="markerClick('Route link','Route name',route.provider_url)" target="_blank">{{route.destinations.start_point}} - {{route.destinations.end_point}}<span v-if="route.oneway === false"> - {{route.destinations.start_point}}</span></a>
                                    </template>
                                    <template v-else>
                                      {{route.destinations.start_point}} - {{route.destinations.end_point}}<span v-if="route.oneway === false"> - {{route.destinations.start_point}}</span>
                                    </template>  
                                    
                                  </h2>
                                  <div class="provider"><span v-if="route.carferry" class="carferry">Car ferry | </span>
                                      <template v-if="route.provider_url"><a :href="route.provider_url" target="_blank">{{route.provider_title}}</a></template>
                                      <template v-else><a href="https://wp.publictransport.is/wp-content/uploads/latest_en.pdf" target="_blank">{{route.provider_title}} (PDF)</a></template>
                                      
                                  </div>      
                                </b-media-body>
                              </b-media>

                            </b-col>
                            <b-col sm="4">
                              <b-button v-if="route.sales_url" @click="markerClick('Sales link','Book now',route.sales_url)" 
                                variant="outline-primary" class="booknow w-100 float-md-right mt-3 mt-sm-0" :href="route.sales_url" target="_blank">
                                    Book now
                              </b-button>  
                            </b-col>
                          </b-row>
                        </b-container>
                                    
                      </div>
                    
                    </div>
                  </div>
                </section>
                          
              </div>

            
            <div slot="modal-footer" class="w-100">
              <template v-if="salesUrl">
                <b-button @click="markerClick('Sales link','Book tours in '+title,'')"  block variant="primary" size="lg" 
                :href="salesUrl" target="_blank">Book Tours in and Around {{title}}</b-button>
              </template>
            </div>
            
          </b-modal>
        </client-only>

    </div>

</template>

<script>
import axios from 'axios'
import  VueAnalytics from 'vue-analytics'



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
    geojson: {
      type: Object
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
    salesUrl: String
  },
  
  data () {
    return {
      fillColor: "#000",
      modalShow: false,
      results: {} 
    };
  },

  mounted() {
    var self = this
    axios.get(`https://wp.publictransport.is/wp-json/pt/v1/marker-routes/${this.slug}`).then((res) => {
      self.results = res.data
    })
  },

  methods: {
    gaEvent: function(cat,act,lab) {
      this.$ga.event({
        eventCategory: cat,
        eventAction: act,
        eventLabel: lab,
      });
    },
    markerClick: function(at,act,lab) {
      /* gaEvent(at,act,lab); */
      this.modalShow = !this.modal
      this.gaEvent(at,act,lab)
    }
    
  },

  computed: {
    latLngs: function () {
      return this.geojson.geometry.coordinates;
    },
    styleFunction() {
      const fillColor = this.fillColor;
      return () => {
        return {
          weight: 2,
          color: "#ECEFF1",
          opacity: 0,
          fillColor: "#0000ff",
          fillOpacity: 0
        };
      };
    }
  }
}
</script>

<style lang="scss">
/* 
  body {
    position: fixed;
  } */

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

        .route-section {
          &:last-of-type {
            .route {
              &:last-child {
                padding-bottom: 0;
                margin-bottom: 0;
                border-bottom: none;
              }
            }
          }
        }

        .route {

          padding-bottom: 16px;
          margin-bottom: 16px;
          border-bottom: 1px solid #dee2e6;

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

            .material-icons {
              margin-top: 2px;
            }
            
          }
          .routeinfo {

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
