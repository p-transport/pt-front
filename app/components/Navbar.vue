<template>
  <nav class="fixed top-0 left-0 right-0 z-50 px-4 pt-3 flex justify-between items-start pointer-events-none">
    <!-- Logo + back button -->
    <div class="flex items-center gap-2">
      <NuxtLink to="/" class="logo-pill px-5 py-3 rounded-full pointer-events-auto text-xl text-white font-semibold no-underline">
        PublicTransport.is
      </NuxtLink>
      <Transition name="back-btn">
        <NuxtLink v-if="isSubpage" to="/" class="glass-pill rounded-full pointer-events-auto flex items-center justify-center w-[52px] h-[52px]">
          <span class="material-icons text-gray-700" style="font-size:36px">chevron_left</span>
        </NuxtLink>
      </Transition>
    </div>

    <!-- Links pill (desktop) + hamburger (mobile) -->
    <div class="relative pointer-events-auto">
      <div class="glass-pill px-2 py-2 rounded-full flex items-center space-x-1">
        <template v-if="!isMobile">
          <NuxtLink to="/about" class="nav-link">About</NuxtLink>
          <NuxtLink to="/howtouse" class="nav-link">How to use</NuxtLink>

          <NuxtLink v-if="infoLink" :to="`/viewer?url=${encodeURIComponent(infoLink.link_url)}`" class="nav-link">
            {{ infoLink.link_title }}
          </NuxtLink>

          <div class="relative" v-if="links.length > 0">
            <button
              @click="dropdownOpen = !dropdownOpen"
              @blur="closeDropdownSoon"
              class="nav-link flex items-center"
            >
              {{ linksTitle }}
              <span class="material-icons text-sm ml-1 text-gray-500">{{ dropdownOpen ? 'arrow_drop_up' : 'arrow_drop_down' }}</span>
            </button>
            <div v-if="dropdownOpen" class="absolute right-0 mt-2 w-48 glass-pill rounded-2xl py-1 z-[60]">
              <NuxtLink
                v-for="(link, index) in links"
                :key="index"
                :to="`/viewer?url=${encodeURIComponent(link.file)}`"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-white/40"
                @click="dropdownOpen = false"
              >
                {{ link.link_title }}
              </NuxtLink>
            </div>
          </div>
        </template>

        <button @click="mobileMenuOpen = !mobileMenuOpen" class="md:hidden text-gray-700 focus:outline-none w-10 h-10 flex items-center justify-center rounded-full relative">
          <Transition name="icon-fade" mode="out-in">
            <span v-if="mobileMenuOpen" key="close" class="material-icons absolute">close</span>
            <span v-else key="menu" class="material-icons absolute">menu</span>
          </Transition>
        </button>
      </div>

      <!-- Mobile dropdown -->
      <div v-if="mobileMenuOpen" class="md:hidden absolute right-0 mt-2 w-56 glass-pill rounded-2xl py-2 z-[60]">
        <NuxtLink to="/" class="mobile-nav-link">Map</NuxtLink>
        <NuxtLink to="/about" class="mobile-nav-link">About</NuxtLink>
        <NuxtLink to="/howtouse" class="mobile-nav-link">How to use</NuxtLink>

        <a v-if="infoLink" :href="infoLink.link_url" target="_blank" class="mobile-nav-link">
          {{ infoLink.link_title }}
        </a>

        <template v-if="links.length > 0">
          <div class="px-4 pt-2 pb-1 text-gray-400 text-xs font-semibold uppercase tracking-wider">
            {{ linksTitle }}
          </div>
          <NuxtLink
            v-for="(link, index) in links"
            :key="index"
            :to="`/viewer?url=${encodeURIComponent(link.file)}`"
            class="mobile-nav-link pl-6"
            @click="mobileMenuOpen = false"
          >
            {{ link.link_title }}
          </NuxtLink>
        </template>
      </div>
    </div>
  </nav>
</template>

<script>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

export default {
  name: 'Navbar',
  setup() {
    const mobileMenuOpen = ref(false)
    const dropdownOpen = ref(false)
    const infoLink = ref(null)
    const links = ref([])
    const linksTitle = ref('PDFs')
    const isMobile = ref(false)

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

    const route = useRoute()
    const isSubpage = computed(() => route.path !== '/')
    watch(() => route.path, () => {
      dropdownOpen.value = false
      mobileMenuOpen.value = false
    })

    onMounted(() => {
      fetchNavLinks()
      const mq = window.matchMedia('(max-width: 767px)')
      isMobile.value = mq.matches
      mq.addEventListener('change', (e) => { isMobile.value = e.matches })
    })

    return { mobileMenuOpen, dropdownOpen, infoLink, links, linksTitle, isMobile, closeDropdownSoon, isSubpage }
  }
}
</script>

<style>
.logo-pill {
  background-color: #a10b0b;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.glass-pill {
  background-color: rgba(255, 255, 255, 0.55);
  -webkit-backdrop-filter: blur(18px) saturate(150%);
  backdrop-filter: blur(18px) saturate(150%);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.nav-link {
  color: #374151;
  text-decoration: none;
  font-size: 0.9rem;
  padding: 0.35rem 0.65rem;
  border-radius: 999px;
  transition: background 0.2s ease, color 0.2s ease;
  background: transparent;
  border: none;
  cursor: pointer;
  white-space: nowrap;
}

.nav-link:hover {
  background: rgba(0, 0, 0, 0.06);
  color: #111827;
}

.mobile-nav-link {
  display: block;
  padding: 0.5rem 1rem;
  color: #374151;
  text-decoration: none;
  transition: background 0.2s ease, color 0.2s ease;
  border-radius: 0.5rem;
  margin: 0 0.25rem;
}

.mobile-nav-link:hover {
  background: rgba(0, 0, 0, 0.05);
  color: #111827;
}

.icon-fade-enter-active,
.icon-fade-leave-active {
  transition: opacity 0.1s ease;
}

.icon-fade-enter-from,
.icon-fade-leave-to {
  opacity: 0;
}

.back-btn-enter-active,
.back-btn-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.back-btn-enter-from,
.back-btn-leave-to {
  opacity: 0;
  transform: translateX(-6px);
}
</style>
