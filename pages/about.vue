<template>
  <div class="container mx-auto px-4 py-8 mt-14">
    <div class="max-w-5xl mx-auto">
      <div class="bg-white p-6 rounded-lg shadow-sm">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <!-- Main content -->
          <div class="lg:col-span-8">
            <h1 class="text-3xl font-bold mb-6">About</h1>
            <div class="prose max-w-none" v-html="results.rendered"></div>
          </div>
          
          <!-- Sidebar with logos -->
          <div class="lg:col-span-4">
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-1 gap-6">
              <div>
                <a href="http://www.hjolafaerni.is/" target="_blank" class="block">
                  <img src="/logos/hjolafaerni.png" class="max-w-full h-auto hover:opacity-80 transition-opacity" alt="Hjolafaerni logo">
                </a>
              </div>
              
              <div>
                <img src="/logos/hugarflug.png" class="max-w-full h-auto" alt="Hugarflug logo">
              </div>
              
              <div>
                <img src="/logos/leidalykill.png" class="max-w-full h-auto" alt="Leidalykill logo">
              </div>
              
              <div>
                <a href="http://www.vegagerdin.is/" target="_blank" class="block">
                  <img src="/logos/vegagerdin.png" class="max-w-full h-auto hover:opacity-80 transition-opacity" alt="Vegagerdin logo">
                </a>
              </div>
              
              <div>
                <a href="http://www.ferdamalastofa.is/" target="_blank" class="block">
                  <img src="/logos/istourist.png" class="max-w-full h-auto hover:opacity-80 transition-opacity" alt="Iceland Tourist Board logo">
                </a>
              </div>
            </div>
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
    axios.get('https://wp.publictransport.is/wp-json/wp/v2/pages/434')
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

