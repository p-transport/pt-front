<template>
  <nav :class="['navbar is-scrolled sticky top-0 z-50 px-4 pt-3', { 'fixed top-0 left-0 right-0': mobileMenuOpen }]">
    <div class="navbar-bar flex items-center justify-between px-5 py-3 rounded-full">
      <a href="/" class="text-xl font-bold text-gray-800 tracking-tight">PublicTransport.is</a>

      <div class="hidden md:flex items-center space-x-1">
        <a href="/about" class="nav-link">About</a>
        <a href="/howtouse" class="nav-link">How to use</a>

        <a v-if="infoLink" :href="infoLink.link_url" target="_blank" class="nav-link">
          {{ infoLink.link_title }}
        </a>

        <div class="relative" v-if="links.length > 0">
          <button
            @click="dropdownOpen = !dropdownOpen"
            @blur="closeDropdownSoon"
            class="nav-link flex items-center"
          >
            {{ linksTitle }}
            <span class="material-icons text-sm ml-1 text-gray-500">{{ dropdownOpen ? 'arrow_drop_up' : 'arrow_drop_down' }}</span>
          </button>

          <div v-if="dropdownOpen" class="absolute right-0 mt-2 w-48 glass-dropdown rounded-2xl py-1 z-[60]">
            <a
              v-for="(link, index) in links"
              :key="index"
              :href="link.file"
              target="_blank"
              class="block px-4 py-2 text-sm text-gray-700 hover:bg-white/40"
            >
              {{ link.link_title }}
            </a>
          </div>
        </div>
      </div>

      <div class="md:hidden">
        <button @click="mobileMenuOpen = !mobileMenuOpen" class="text-gray-700 focus:outline-none p-1">
          <span class="material-icons">{{ mobileMenuOpen ? 'close' : 'menu' }}</span>
        </button>
      </div>
    </div>

    <!-- Mobile menu -->
    <div v-if="mobileMenuOpen" class="md:hidden glass-dropdown mx-0 mt-1 rounded-2xl relative z-[100]">
      <div class="px-5 pt-4 pb-6">
        <div class="flex flex-col space-y-1">
          <a href="/" class="mobile-nav-link">Map</a>
          <a href="/about" class="mobile-nav-link">About</a>
          <a href="/howtouse" class="mobile-nav-link">How to use</a>

          <a v-if="infoLink" :href="infoLink.link_url" target="_blank" class="mobile-nav-link">
            {{ infoLink.link_title }}
          </a>

          <div v-if="links.length > 0" class="pt-3 pb-1 text-gray-400 text-xs font-semibold uppercase tracking-wider">
            {{ linksTitle }}
          </div>

          <div class="border-l-2 border-gray-200/60">
            <a
              v-for="(link, index) in links"
              :key="index"
              :href="link.file"
              target="_blank"
              class="mobile-nav-link ml-4"
            >
              {{ link.link_title }}
            </a>
          </div>
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

    const closeDropdownSoon = () => {
      setTimeout(() => { dropdownOpen.value = false }, 200)
    }

    const fetchNavLinks = async () => {
      try {
        const { data } = await axios.get('https://wp.publictransport.is/wp-json/pt/v1/options')
        if (data?.info) infoLink.value = data.info
        if (data?.links && Array.isArray(data.links)) links.value = data.links
        if (data?.links_title) linksTitle.value = data.links_title
      } catch (error) {
        console.error('Error fetching navbar links:', error)
      }
    }

    onMounted(() => { fetchNavLinks() })

    return { mobileMenuOpen, dropdownOpen, infoLink, links, linksTitle, closeDropdownSoon }
  }
}
</script>

<style>
.navbar-bar {
  background-color: rgba(255, 255, 255, 0.55);
  -webkit-backdrop-filter: blur(18px) saturate(150%);
  backdrop-filter: blur(18px) saturate(150%);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.07);
}

.glass-dropdown {
  background: rgba(255, 255, 255, 0.75);
  -webkit-backdrop-filter: blur(18px) saturate(150%);
  backdrop-filter: blur(18px) saturate(150%);
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.09);
}

.nav-link, .nav-link-btn {
  color: #374151;
  text-decoration: none;
  font-size: 0.9rem;
  padding: 0.35rem 0.65rem;
  border-radius: 999px;
  transition: background 0.2s ease, color 0.2s ease;
  background: transparent;
  border: none;
  cursor: pointer;
}

.nav-link:hover, .nav-link-btn:hover {
  background: rgba(0, 0, 0, 0.06);
  color: #111827;
}

.mobile-nav-link {
  display: block;
  padding: 0.5rem 0.5rem;
  color: #374151;
  text-decoration: none;
  border-radius: 0.5rem;
  transition: background 0.2s ease, color 0.2s ease;
}

.mobile-nav-link:hover {
  background: rgba(0, 0, 0, 0.05);
  color: #111827;
}
</style>
