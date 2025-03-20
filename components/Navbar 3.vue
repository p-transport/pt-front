<template>
  <nav class="fixed top-0 left-0 right-0 bg-white bg-opacity-90 shadow-md z-50">
    <div class="container mx-auto px-4 py-3">
      <div class="flex justify-between items-center">
        <div class="flex items-center">
          <a href="/" class="text-xl font-bold text-blue-600">Public Transport Iceland</a>
        </div>
        <div class="hidden md:flex space-x-6">
          <a href="/" class="text-gray-700 hover:text-blue-600">Map</a>
          <a href="https://wp.publictransport.is" target="_blank" class="text-gray-700 hover:text-blue-600">About</a>
          <a href="https://wp.publictransport.is/wp-content/uploads/latest_en.pdf" target="_blank" class="text-gray-700 hover:text-blue-600">Timetables</a>
        </div>
        <div class="md:hidden">
          <button @click="mobileMenuOpen = !mobileMenuOpen" class="text-gray-700 focus:outline-none">
            <span class="material-icons">{{ mobileMenuOpen ? 'close' : 'menu' }}</span>
          </button>
        </div>
      </div>
    </div>
    
    <!-- Mobile menu -->
    <div v-if="mobileMenuOpen" class="md:hidden bg-white bg-opacity-90 border-t">
      <div class="container mx-auto px-4 py-2">
        <div class="flex flex-col space-y-3">
          <a href="/" class="block py-2 text-gray-700 hover:text-blue-600">Map</a>
          <a href="https://wp.publictransport.is" target="_blank" class="block py-2 text-gray-700 hover:text-blue-600">About</a>
          <a href="https://wp.publictransport.is/wp-content/uploads/latest_en.pdf" target="_blank" class="block py-2 text-gray-700 hover:text-blue-600">Timetables</a>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'Navbar',
  setup() {
    const mobileMenuOpen = ref(false)
    
    return {
      mobileMenuOpen
    }
  }
}
</script> 