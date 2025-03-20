// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  // Setting SPA mode, equivalent to mode: 'spa' in Nuxt 2
  ssr: false,

  app: {
    head: {
      title: 'PublicTransport.is',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Public Transport' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Inter:400,700,900|Material+Icons&display=swap' }
      ]
    }
  },

  // Global CSS
  css: [
    '~/assets/css/main.css',
    '~/assets/css/leaflet.css',
  ],

  // Modules
  modules: [
    '@nuxtjs/tailwindcss',
  ],

  // Build Configuration
  build: {
    transpile: ['leaflet'],
  },

  // Nuxt.js Runtime Config
  runtimeConfig: {
    public: {
      apiBaseUrl: 'https://wp.publictransport.is/wp-json',
      googleAnalyticsMeasurementId: process.env.GOOGLE_ANALYTICS_ID || 'G-877BES8YN8' // Replace with actual ID when available
    }
  },

  compatibilityDate: '2025-03-20'
})