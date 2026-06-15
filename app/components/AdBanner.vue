<template>
  <div v-if="!dismissed" class="ad-pill">
    <a
      href="https://publictransport.tourdesk.is/Transportation/Transfer?searchParameter=%22airport%20direct%22%20%22flybus%22"
      target="_blank"
      rel="noopener noreferrer"
      class="ad-link"
    >
      <span class="material-icons ad-icon">flight</span>
      <span class="ad-label">Book your airport transfer</span>
      <span class="ad-cta">Book now</span>
    </a>
    <button class="ad-dismiss" @click.stop="dismissed = true" aria-label="Dismiss">
      <span class="material-icons">close</span>
    </button>
  </div>
</template>

<script>
export default {
  name: 'AdBanner',
  props: {
    size: { type: String, default: 'leaderboard' }
  },
  data() {
    return { dismissed: false }
  }
}
</script>

<style scoped>
.ad-pill {
  display: inline-flex;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.55);
  -webkit-backdrop-filter: blur(18px) saturate(150%);
  backdrop-filter: blur(18px) saturate(150%);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 999px;
  padding: 0.5rem 0.5rem 0.5rem 1.25rem;
  gap: 0.5rem;
}

.ad-link {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  text-decoration: none;
  color: #374151;
  white-space: nowrap;
}

.ad-icon {
  font-size: 1.2rem;
  color: var(--primary);
  flex-shrink: 0;
}

.ad-label {
  font-size: 0.95rem;
  font-weight: 500;
  color: #374151;
}

.ad-cta {
  display: inline-flex;
  align-items: center;
  background-color: #0066cc;
  color: #fff;
  font-size: 0.85rem;
  font-weight: 600;
  padding: 0.4rem 0.9rem;
  border-radius: 999px;
  transition: background 0.2s ease;
  white-space: nowrap;
  flex-shrink: 0;
}

.ad-link:hover .ad-cta {
  background-color: #004f99;
}

.ad-dismiss {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 999px;
  border: none;
  background: transparent;
  color: #9ca3af;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;
  padding: 0;
  flex-shrink: 0;
}

.ad-dismiss .material-icons {
  font-size: 1rem;
}

.ad-dismiss:hover {
  background: rgba(0, 0, 0, 0.06);
  color: #374151;
}

@media (max-width: 480px) {
  .ad-pill {
    max-width: calc(100vw - 80px);
  }
  .ad-label {
    overflow: hidden;
    text-overflow: ellipsis;
    min-width: 0;
    max-width: 110px;
  }
}
</style>
