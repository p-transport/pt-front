<template>
  <div class="container mx-auto px-4 py-8 mt-14">
    <div class="max-w-5xl mx-auto">
      <div class="bg-white p-6 rounded-lg shadow-sm">
        <div class="grid grid-cols-1 gap-8">
          <div>
            <h1 class="text-3xl font-bold mb-6">How to use</h1>
            <div class="prose max-w-none" v-html="results.rendered"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      results: {
        rendered: ''
      }
    }
  },
  mounted() {
    axios.get('https://wp.publictransport.is/wp-json/wp/v2/pages/484')
      .then(response => {
        this.results = response.data.content
      })
      .catch(error => {
        console.error('Error fetching page content:', error)
      })
  }
}
</script>

<style>
.prose img {
  max-width: 100%;
  height: auto;
}
</style>

