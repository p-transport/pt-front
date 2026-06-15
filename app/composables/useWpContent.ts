import { ref, type Ref } from 'vue'

const _cache = new Map<number, Ref<string>>()

export function useWpContent(pageId: number) {
  if (!_cache.has(pageId)) {
    _cache.set(pageId, ref(''))
  }
  const content = _cache.get(pageId)!

  async function load() {
    if (content.value) return
    try {
      const res = await fetch(`https://wp.publictransport.is/wp-json/wp/v2/pages/${pageId}`)
      if (!res.ok) {
        console.warn(`WP page ${pageId} returned ${res.status}`)
        return
      }
      const data = await res.json()
      content.value = data.content.rendered
    } catch (e) {
      console.error(`Failed to fetch WP page ${pageId}:`, e)
    }
  }

  return { content, load }
}
