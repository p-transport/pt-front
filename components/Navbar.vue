<template>
  <nav :class="['bg-[#a10b0b] z-50 border-b-0', { 'fixed top-0 left-0 right-0': mobileMenuOpen }]">
    <div class="container-fluid px-4 py-3 mb-0">
      <div class="flex justify-between items-center">
        <div class="flex items-center">
          <a href="/" class="text-xl font-bold text-white">PublicTransport.is</a>
        </div>
        <div class="hidden md:flex space-x-6">
          <!-- Navigation links -->
          <a href="/about" class="nav-link">About</a>
          <a href="/howtouse" class="nav-link">How to use</a>
          
          <!-- Info link from API -->
          <a v-if="infoLink" :href="infoLink.link_url" target="_blank" class="nav-link">
            {{ infoLink.link_title }}
          </a>
          
          <!-- Dropdown for PDF links -->
          <div class="relative" v-if="links.length > 0">
            <button 
              @click="dropdownOpen = !dropdownOpen" 
              @blur="closeDropdownSoon"
              class="nav-link-btn flex items-center"
            >
              {{ linksTitle }}
              <span class="material-icons text-sm ml-1 text-white">{{ dropdownOpen ? 'arrow_drop_up' : 'arrow_drop_down' }}</span>
            </button>
            
            <div v-if="dropdownOpen" class="absolute right-0 mt-2 w-48 bg-white rounded-md py-1 z-[60]">
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
    <div v-if="mobileMenuOpen" class="md:hidden bg-[#a10b0b] border-t border-white border-opacity-20 relative z-[100]">
      <div class="container-fluid px-4 py-2">
        <div class="flex flex-col space-y-3">
          <a href="/" class="mobile-nav-link">Map</a>
          <a href="/about" class="mobile-nav-link">About</a>
          <a href="/howtouse" class="mobile-nav-link">How to use</a>
          
          <!-- Info link in mobile menu -->
          <a v-if="infoLink" :href="infoLink.link_url" target="_blank" class="mobile-nav-link">
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
            class="mobile-nav-link pl-3 border-l-2 border-white border-opacity-40"
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

/* Handle mobile menu z-index and overlay */
@media (max-width: 767px) {
  nav.fixed + .mobile-menu-open {
    padding-top: 50px;
    position: relative;
    z-index: 99;
  }
}

/* Modern animated nav links for desktop */
.nav-link, .nav-link-btn {
  position: relative;
  color: white;
  text-decoration: none;
  padding-bottom: 2px;
  transition: color 0.3s ease;
}

.nav-link::after, .nav-link-btn::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 1px;
  bottom: -2px;
  left: 0;
  background-color: white;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.nav-link:hover::after, .nav-link-btn:hover::after {
  opacity: 1;
}

/* Mobile nav links with animated line effect */
.mobile-nav-link {
  position: relative;
  display: block;
  padding: 0.5rem 0;
  color: white;
  text-decoration: none;
  transition: color 0.3s ease;
  overflow: hidden;
}

.mobile-nav-link::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 1px;
  bottom: 0;
  left: 0;
  background-color: white;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.mobile-nav-link:hover::after {
  opacity: 1;
}
</style> 