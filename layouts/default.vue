<template>
  <div>
    <b-navbar toggleable="sm" type="dark" fixed="top">
      <b-navbar-brand href="/">PublicTransport.is</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <no-ssr>
          <b-navbar-nav class="ml-auto">
            <span v-for="info in results" v-bind:key="info.id">
              <b-nav-item :href="info.link_url" target="_blank">{{info.link_title}}</b-nav-item>
            </span>
              <b-nav-item href="/howtouse">How to use/Legend</b-nav-item>
              <b-nav-item href="/about">About</b-nav-item>


          <b-nav-item-dropdown :text="results.links_title" right>
            <span v-for="link in results.links" v-bind:key="link.id">
              <b-dropdown-item :href="link.file" target="_blank">{{link.link_title}}</b-dropdown-item>
            </span>
          </b-nav-item-dropdown>

          </b-navbar-nav>
        </no-ssr>
      </b-collapse>

    </b-navbar>
    <nuxt />
  </div>
</template>

<script>
import axios from 'axios';

export default {
    props: {
        info: {},
        links: {}
    },
    data () {
        return {
            results: {} 
        }
    },
    mounted() {
        var self = this
        axios.get('http://wp.publictransport.is/wp-json/pt/v1/options').then((res) => {
        self.results = res.data
    })
  },
}
</script>

<style lang="scss">
  .navbar {
    background-color: #A10B0B;
    
    .navbar-brand {
      font-weight: bold;
    }

    .nav-link.nav-link {
      color: white;
      &:hover {
        color: white;
        text-decoration: underline;
      }
    }
  }
</style>
