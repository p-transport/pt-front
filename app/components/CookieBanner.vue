<template>
  <Teleport to="body">
    <Transition name="cookie-slide">
      <div v-if="visible" class="cookie-banner" role="dialog" aria-label="Cookie consent" aria-live="polite">
        <div class="cookie-inner">
          <div class="cookie-text">
            <p>
              We use cookies to improve your experience and analyse site traffic.
              <NuxtLink to="/cookies" class="cookie-link">Learn more</NuxtLink>
            </p>
          </div>
          <div class="cookie-actions">
            <button class="btn-reject" @click="reject">Reject non-essential</button>
            <button class="btn-accept" @click="accept">Accept all</button>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="cookie-slide">
      <NuxtLink v-if="!visible && settled" to="/cookies" class="cookie-settings-btn" aria-label="Cookie settings">
        <span class="material-icons" style="font-size:18px;color:#8B5E3C;">cookie</span>
      </NuxtLink>
    </Transition>
  </Teleport>
</template>

<script>
import { ref, onMounted } from 'vue'

const STORAGE_KEY = 'cookie_consent'

export default {
  name: 'CookieBanner',
  setup() {
    const visible = ref(false)
    const settled = ref(false) // true once a choice has been stored

    onMounted(() => {
      if (!localStorage.getItem(STORAGE_KEY)) {
        visible.value = true
      } else {
        settled.value = true
      }
    })

    function accept() {
      localStorage.setItem(STORAGE_KEY, 'accepted')
      visible.value = false
      settled.value = true
      window.dispatchEvent(new Event('cookie-consent-accepted'))
    }

    function reject() {
      localStorage.setItem(STORAGE_KEY, 'rejected')
      visible.value = false
      settled.value = true
    }

    return { visible, settled, accept, reject }
  }
}
</script>

<style scoped>
.cookie-banner {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  width: calc(100% - 32px);
  max-width: 760px;
  background: rgba(255, 255, 255, 0.72);
  -webkit-backdrop-filter: blur(18px) saturate(150%);
  backdrop-filter: blur(18px) saturate(150%);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 1.25rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.10);
  padding: 16px 20px;
}

.cookie-inner {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.cookie-text {
  flex: 1;
  min-width: 200px;
  font-size: 0.875rem;
  color: #374151;
  line-height: 1.5;
}

.cookie-text p {
  margin: 0;
}

.cookie-link {
  color: #0066cc;
  text-decoration: underline;
  white-space: nowrap;
}

.cookie-link:hover {
  color: #0052a3;
}

.cookie-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
  flex-wrap: wrap;
}

.btn-reject {
  padding: 8px 16px;
  border-radius: 999px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid rgba(0, 0, 0, 0.15);
  background: transparent;
  color: #374151;
  transition: background 0.2s ease, color 0.2s ease;
  white-space: nowrap;
}

.btn-reject:hover {
  background: rgba(0, 0, 0, 0.06);
  color: #111827;
}

.btn-accept {
  padding: 8px 20px;
  border-radius: 999px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  background: #0066cc;
  color: #fff;
  transition: background 0.2s ease;
  white-space: nowrap;
}

.btn-accept:hover {
  background: #0052a3;
}

/* Persistent cookie settings button */
.cookie-settings-btn {
  position: fixed;
  bottom: 20px;
  left: 20px;
  z-index: 1000;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.72);
  -webkit-backdrop-filter: blur(18px) saturate(150%);
  backdrop-filter: blur(18px) saturate(150%);
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.10);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  text-decoration: none;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  line-height: 1;
}

.cookie-settings-btn:hover {
  transform: scale(1.12);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.14);
}

@media (max-width: 480px) {
  .cookie-settings-btn {
    bottom: calc(16px + env(safe-area-inset-bottom, 0px));
    left: 16px;
  }
}

/* Slide up / down transition */
.cookie-slide-enter-active,
.cookie-slide-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.cookie-slide-enter-from,
.cookie-slide-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(16px);
}

@media (max-width: 480px) {
  .cookie-banner {
    bottom: calc(16px + env(safe-area-inset-bottom, 0px));
  }

  .cookie-inner {
    flex-direction: column;
    align-items: stretch;
  }

  .cookie-actions {
    flex-direction: column;
  }

  .btn-reject,
  .btn-accept {
    width: 100%;
    text-align: center;
  }
}
</style>
