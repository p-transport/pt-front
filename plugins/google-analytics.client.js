// plugins/google-analytics.client.js
export default defineNuxtPlugin((nuxtApp) => {
  const runtimeConfig = useRuntimeConfig()
  const measurementId = runtimeConfig.public.googleAnalyticsMeasurementId

  // Only load on client-side and if a valid measurement ID is provided
  // Valid Google Analytics 4 IDs start with G- followed by alphanumeric characters
  if (process.client && measurementId && /^G-[A-Z0-9]+$/i.test(measurementId) && measurementId !== 'G-877BES8YN8') {
    // Load the Google Analytics script
    function loadGoogleAnalytics() {
      const script = document.createElement('script')
      script.async = true
      script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
      document.head.appendChild(script)
      
      window.dataLayer = window.dataLayer || []
      function gtag() {
        window.dataLayer.push(arguments)
      }
      
      gtag('js', new Date())
      gtag('config', measurementId)
      
      // Make gtag available globally
      window.gtag = gtag
      
      return gtag
    }
    
    // Initialize GA
    const gtag = loadGoogleAnalytics()
    
    // Add to Vue context
    nuxtApp.provide('gtag', (event, action, params = {}) => {
      if (window.gtag) {
        console.log('Tracking event:', event, action, params)
        window.gtag('event', event, {
          action: action,
          ...params
        })
      }
    })
  } else {
    // Provide a dummy function when GA is not loaded
    nuxtApp.provide('gtag', () => {
      // Do nothing in SSR or when no measurement ID is available
      console.log('Google Analytics not loaded: Invalid or missing measurement ID')
    })
  }
}) 