// plugins/google-analytics.client.js
export default defineNuxtPlugin((nuxtApp) => {
  const runtimeConfig = useRuntimeConfig()
  const measurementId = runtimeConfig.public.googleAnalyticsMeasurementId
  const isValidId = /^G-[A-Z0-9]+$/i.test(measurementId)

  if (!process.client || !measurementId || !isValidId) {
    nuxtApp.provide('gtag', () => {
      console.log('Google Analytics not loaded: Invalid or missing measurement ID')
    })
    return
  }

  let initialized = false

  function loadGoogleAnalytics() {
    if (initialized) return
    initialized = true

    const script = document.createElement('script')
    script.async = true
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + measurementId
    document.head.appendChild(script)

    window.dataLayer = window.dataLayer || []
    function gtag() { window.dataLayer.push(arguments) }
    gtag('js', new Date())
    gtag('config', measurementId)
    window.gtag = gtag
  }

  // Provide $gtag — works whether GA loaded or not (gtag buffers via dataLayer)
  nuxtApp.provide('gtag', (event, action, params = {}) => {
    if (window.gtag) {
      window.gtag('event', event, { action, ...params })
    }
  })

  // Init GA now if consent already given, otherwise wait for the banner event
  const initIfConsented = () => {
    if (localStorage.getItem('cookie_consent') === 'accepted') {
      loadGoogleAnalytics()
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initIfConsented)
  } else {
    initIfConsented()
  }

  // Verify localStorage before acting — prevents spoofed events from bypassing consent
  window.addEventListener('cookie-consent-accepted', () => {
    if (localStorage.getItem('cookie_consent') === 'accepted') {
      loadGoogleAnalytics()
    }
  })
})
