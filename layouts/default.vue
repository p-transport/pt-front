<template>
  <div class="min-h-screen flex flex-col">
    <Navbar />
    <main class="m-0 p-0 flex-grow">
      <slot />
    </main>
    <!-- Footer container and ad banner removed -->
  </div>
</template>

<script>
import Navbar from '~/components/Navbar.vue'
// Removed import for AdBanner

export default {
  components: {
    Navbar,
    // Removed AdBanner component
  },
  data() {
    return {
      windowWidth: 0
    }
  },
  // Removed adBannerSize computed property
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
  },
  head() {
    return {
      meta: [
        // Add viewport meta with viewport-fit=cover for iOS safe areas
        { 
          name: 'viewport', 
          content: 'width=device-width, initial-scale=1, viewport-fit=cover'
        }
      ]
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

/* Removed footer-container and footer-ad styles */
</style>
