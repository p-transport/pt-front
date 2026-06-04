<template>
  <div class="container mx-auto p-8">
    <h1 class="text-4xl font-bold mb-6">Ad Banner Test Page</h1>
    
    <p class="mb-4">This page is designed to test the visibility of the ad banner at the bottom of the page.</p>
    
    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Content Section</h2>
      <p class="mb-4">Here is some content to fill the page. The ad banner should appear at the bottom of the page.</p>
      <p class="mb-4">If you scroll down, you should see the ad banner at the bottom.</p>
    </div>
    
    <!-- Add more content to ensure page is tall enough to scroll -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div v-for="n in 10" :key="n" class="bg-gray-100 p-6 rounded-lg">
        <h3 class="text-xl font-semibold mb-2">Content Block {{ n }}</h3>
        <p>This is a content block that helps demonstrate the ad banner's position at the bottom of the page.</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TestAdPage',
  head() {
    return {
      title: 'Ad Banner Test Page'
    }
  }
}
</script>

<style scoped>
.container {
  min-height: 150vh; /* Make sure the page is scrollable */
}
</style> 