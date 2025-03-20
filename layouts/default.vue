<template>
  <div class="min-h-screen">
    <Navbar />
    <main class="m-0 p-0">
      <slot />
    </main>
  </div>
</template>

<script>
import Navbar from '~/components/Navbar.vue'

export default {
  components: {
    Navbar
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
