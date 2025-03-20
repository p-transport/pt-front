<template>
  <nav class="fixed top-0 left-0 right-0 bg-[#a10b0b] z-50">
    <div class="container-fluid px-4 py-3">
      <div class="flex justify-between items-center">
        <div class="flex items-center">
          <a href="/" class="text-xl font-bold text-white">PublicTransport.is</a>
        </div>
        <div class="hidden md:flex space-x-6">
          <!-- Navigation links -->
          <a href="/" class="text-white hover:text-white hover:underline">Map</a>
          <a href="https://wp.publictransport.is" target="_blank" class="text-white hover:text-white hover:underline">About</a>
          
          <!-- Info link from API -->
          <a v-if="infoLink" :href="infoLink.link_url" target="_blank" class="text-white hover:text-white hover:underline">
            {{ infoLink.link_title }}
          </a>
          
          <!-- Dropdown for PDF links -->
          <div class="relative" v-if="links.length > 0">
            <button 
              @click="dropdownOpen = !dropdownOpen" 
              @blur="closeDropdownSoon"
              class="text-white hover:text-white hover:underline flex items-center"
            >
              {{ linksTitle }}
              <span class="material-icons text-sm ml-1 text-white">{{ dropdownOpen ? 'arrow_drop_up' : 'arrow_drop_down' }}</span>
            </button>
            
            <div v-if="dropdownOpen" class="absolute right-0 mt-2 w-48 bg-white rounded-md py-1 z-10">
              <a 
                v-for="(link, index) in links" 
                :key="index" 
                :href="link.file" 
                target="_blank"
                class="block px-4 py-2 text-sm text-[#a10b0b] hover:bg-gray-100"
              >
                {{ link.link_title }}
              </a>
            </div>
          </div>
        </div>
        <div class="md:hidden">
          <button @click="mobileMenuOpen = !mobileMenuOpen" class="text-white focus:outline-none">
            <span class="material-icons">{{ mobileMenuOpen ? 'close' : 'menu' }}</span>
          </button>
        </div>
      </div>
    </div>
    
    <!-- Mobile menu -->
    <div v-if="mobileMenuOpen" class="md:hidden bg-[#a10b0b] border-t border-white border-opacity-20">
      <div class="container-fluid px-4 py-2">
        <div class="flex flex-col space-y-3">
          <a href="/" class="block py-2 text-white hover:text-white hover:underline">Map</a>
          <a href="https://wp.publictransport.is" target="_blank" class="block py-2 text-white hover:text-white hover:underline">About</a>
          
          <!-- Info link in mobile menu -->
          <a v-if="infoLink" :href="infoLink.link_url" target="_blank" class="block py-2 text-white hover:text-white hover:underline">
            {{ infoLink.link_title }}
          </a>
          
          <!-- PDF links section header -->
          <div v-if="links.length > 0" class="pt-1 pb-1 text-white text-sm font-semibold">
            {{ linksTitle }}
          </div>
          
          <!-- PDF links in mobile menu -->
          <a 
            v-for="(link, index) in links" 
            :key="index" 
            :href="link.file" 
            target="_blank"
            class="block py-2 pl-3 text-white hover:text-white hover:underline border-l-2 border-white border-opacity-40"
          >
            {{ link.link_title }}
          </a>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { ref, onMounted } from 'vue'
import axios from 'axios'

export default {
  name: 'Navbar',
  setup() {
    const mobileMenuOpen = ref(false)
    const dropdownOpen = ref(false)
    const infoLink = ref(null)
    const links = ref([])
    const linksTitle = ref('PDFs')
    
    // Close dropdown with delay to allow click on links
    const closeDropdownSoon = () => {
      setTimeout(() => {
        dropdownOpen.value = false
      }, 200)
    }
    
    // Fetch additional links from the API
    const fetchNavLinks = async () => {
      try {
        const { data } = await axios.get('https://wp.publictransport.is/wp-json/pt/v1/options')
        
        // Get the info link
        if (data && data.info) {
          infoLink.value = data.info
        }
        
        // Get the PDF links
        if (data && data.links && Array.isArray(data.links)) {
          links.value = data.links
        }
        
        // Get the links section title
        if (data && data.links_title) {
          linksTitle.value = data.links_title
        }
        
        console.log('Navbar data loaded:', { 
          infoLink: infoLink.value,
          links: links.value,
          linksTitle: linksTitle.value
        })
      } catch (error) {
        console.error('Error fetching navbar links:', error)
      }
    }
    
    onMounted(() => {
      fetchNavLinks()
    })
    
    return {
      mobileMenuOpen,
      dropdownOpen,
      infoLink,
      links,
      linksTitle,
      closeDropdownSoon
    }
  }
}
</script>

<style>
.container-fluid {
  width: 100%;
  margin-right: auto;
  margin-left: auto;
}
</style> 