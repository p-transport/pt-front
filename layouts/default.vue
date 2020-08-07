<template>
  <div>
    <b-navbar toggleable="sm" type="dark" fixed="top">
      <b-navbar-brand href="/">PublicTransport.is</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <client-only>
          <b-navbar-nav class="ml-auto">
              <b-button v-b-modal.covid variant="light">C-19</b-button>
            <span v-for="info in results" v-bind:key="info.id">
              <b-nav-item :href="info.link_url" target="_blank">{{info.link_title}}</b-nav-item>
            </span>
              <b-nav-item href="/about">About</b-nav-item>
              <b-nav-item href="/howtouse">How to use</b-nav-item>
          <b-nav-item-dropdown :text="results.links_title" right>
            <span v-for="link in results.links" v-bind:key="link.id">
              <b-dropdown-item :href="link.file" target="_blank">{{link.link_title}}</b-dropdown-item>
            </span>
          </b-nav-item-dropdown>

          </b-navbar-nav>
        </client-only>
      </b-collapse>

    </b-navbar>
    <nuxt />
      <b-modal id="covid" title="Information regarding Coronavirus" header-bg-variant="dark" header-text-variant="warning" ok-only>
        <p>The coronavirus pandemy severly affects travelling in Iceland.</p>
        <p>This website shows the public transport routes of last year, 2019.</p>
        <p>During the pandemy, routes may be suspended or travel bans may apply.</p>
        <p>Contact bus / ferry / airline operators before travelling; for websites / phone numbers, see "<a href="https://wp.publictransport.is/wp-content/uploads/2020/06/pt2020_en.pdf">Map with operators</a>".</p>
        <p>Avoid unnecessary travels, and follow rules on <a href="https://www.covid.is/" target="_blank">www.covid.is</a></p>
      </b-modal>    
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
        axios.get('https://wp.publictransport.is/wp-json/pt/v1/options').then((res) => {
        self.results = res.data

      if (!this.$cookies.get('covidModal', true)) {
        this.$bvModal.show('covid');
        this.$cookies.set('covidModal', true, {
          path: '/',
          maxAge: 60 * 60 * 24 * 7
        })
      }        
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
