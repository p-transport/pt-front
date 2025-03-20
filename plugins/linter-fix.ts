// This file is used to provide TypeScript support for Nuxt 3 auto-imports
// It doesn't actually have any functionality
export default defineNuxtPlugin(() => {})

declare global {
  const ref: typeof import('vue')['ref']
  const computed: typeof import('vue')['computed']
  const onMounted: typeof import('vue')['onMounted']
  const defineProps: any
} 