export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('app:mounted', () => {
    const el = document.getElementById('page-loader')
    if (!el) return
    el.classList.add('out')
    setTimeout(() => el.remove(), 450)
  })
})
