<template>
  <div class="min-h-screen flex flex-col">
    <Navbar />
    <main class="m-0 p-0 flex-grow">
      <slot />
    </main>
    <!-- Always show the ad banner at the bottom -->
    <div class="sticky-footer">
      <AdBanner :size="adBannerSize" />
    </div>
  </div>
</template>

<script>
import Navbar from '~/components/Navbar.vue'
import AdBanner from '~/components/AdBanner.vue'

export default {
  components: {
    Navbar,
    AdBanner
  },
  data() {
    return {
      windowWidth: 0
    }
  },
  computed: {
    adBannerSize() {
      // Determine the appropriate ad size based on screen width
      if (this.windowWidth >= 768) {
        return 'leaderboard'; // Desktop
      } else {
        return 'large-mobile'; // Mobile
      }
    }
  },
  mounted() {
    // Set initial window width
    this.windowWidth = window.innerWidth;
    
    // Add event listener for window resize
    window.addEventListener('resize', this.handleResize);
  },
  beforeDestroy() {
    // Remove event listener when component is destroyed
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    handleResize() {
      this.windowWidth = window.innerWidth;
    }
  }
}
</script>

<style>
:root {
  --primary: #0066cc;
  --primary-hover: #0052a3;
}

/* Global styles */
body, html {
  margin: 0;
  padding: 0;
  height: 100%;
}

/* Make sure the footer stays at bottom */
.sticky-footer {
  width: 100%;
  bottom: 0;
  left: 0;
}

.min-h-screen {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.flex-grow {
  flex-grow: 1;
}

.text-primary {
  color: var(--primary);
}

.bg-primary {
  background-color: var(--primary);
}

.hover\:bg-primary:hover {
  background-color: var(--primary);
}

.hover\:text-primary:hover {
  color: var(--primary);
}

.border-primary {
  border-color: var(--primary);
}
</style>
