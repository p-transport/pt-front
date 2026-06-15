<template>
  <div class="min-h-screen flex flex-col">
    <Navbar />
    <main class="m-0 p-0 flex-grow bg-white">
      <slot />
    </main>
    <CookieBanner />
  </div>
</template>

<script setup>
import CookieBanner from '~/components/CookieBanner.vue'

const wp434 = useWpContent(434)
const wp484 = useWpContent(484)

onMounted(() => {
  wp434.load()
  wp484.load()
})

useHead({
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/icon?family=Material+Icons' }
  ],
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' }
  ]
})
</script>

<style>
:root {
  --primary: #0066cc;
  --primary-hover: #0052a3;
  --safe-area-inset-top: env(safe-area-inset-top, 0px);
  --safe-area-inset-bottom: env(safe-area-inset-bottom, 0px);
}

/* Global styles */
body, html {
  margin: 0;
  padding: 0;
  height: 100%;
  /* Prevent overscroll/bounce effect */
  width: 100%;
}

/* Fix for iOS vh units */
@supports (-webkit-touch-callout: none) {
  .min-h-screen {
    min-height: -webkit-fill-available;
  }
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

/* Page transitions — fade to white between routes */
.page-leave-active {
  transition: opacity 0.18s ease;
}
.page-enter-active {
  transition: opacity 0.25s ease;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style>
