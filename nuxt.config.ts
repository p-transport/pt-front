// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  devtools: { enabled: true },

  // Setting SPA mode, equivalent to mode: 'spa' in Nuxt 2
  // ssr: false,

  app: {
    head: {
      title: 'PublicTransport.is',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'An interactive map showing public transport options in and around Iceland.' },
        { property: 'og:title', content: 'PublicTransport.is - Iceland Public Transport Map' },
        { property: 'og:site_name', content: 'PublicTransport.is' },
        { property: 'og:description', content: 'An interactive map showing public transport options in and around Iceland.' },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://www.publictransport.is/' },
        { property: 'og:image', content: 'https://www.publictransport.is/ptss.jpg' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:image:alt', content: 'Screenshot of the PublicTransport.is map interface' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'PublicTransport.is - Iceland Public Transport Map' },
        { name: 'twitter:description', content: 'An interactive map showing public transport options in and around Iceland.' },
        { name: 'twitter:image', content: 'https://www.publictransport.is/ptss.jpg' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'preload', href: '/pt20240711_en.svg', as: 'image', type: 'image/svg+xml' },
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
    '@nuxtjs/google-fonts'
  ],

  // Google Fonts configuration
  googleFonts: {
    families: {
      Inter: [400, 700, 900],
      'Material Icons': true
    },
    display: 'swap', // Recommended for performance
    subsets: ['latin', 'latin-ext'],
    download: false,
    prefetch: true,
    preconnect: true,
  },

  // Build Configuration
  build: {
    transpile: ['leaflet'],
  },

  // Nuxt.js Runtime Config
  runtimeConfig: {
    public: {
      apiBaseUrl: 'https://wp.publictransport.is/wp-json',
      googleAnalyticsMeasurementId: process.env.GOOGLE_ANALYTICS_ID || "G-877BES8YN8" // Set to empty string if no ID provided
    }
  },

  compatibilityDate: '2025-03-20'
})