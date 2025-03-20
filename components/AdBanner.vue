<template>
  <div v-if="!dismissed" class="ad-banner-container">
    <div class="ad-banner" :class="sizeClass">
      <div class="dismiss-button" @click="dismissAd">
        <span>&times;</span>
      </div>
      <div v-if="!adLoaded" class="ad-placeholder">
        <span>Advertisement</span>
      </div>
      <div v-else class="ad-content">
        <!-- Actual ad content will go here, this is just a placeholder -->
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdBanner',
  props: {
    size: {
      type: String,
      default: 'leaderboard',
      validator: value => ['leaderboard', 'large-mobile', 'medium-rectangle', 'skyscraper', 'wide-skyscraper'].includes(value)
    }
  },
  data() {
    return {
      adLoaded: false, // Would be set to true when ad content is loaded
      dismissed: false, // Track if the ad has been dismissed
      adSizes: {
        // Standard IAB ad sizes
        leaderboard: { width: 728, height: 90 }, // Desktop leaderboard
        'large-mobile': { width: 320, height: 100 }, // Large mobile banner
        'medium-rectangle': { width: 300, height: 250 }, // Medium rectangle (common)
        skyscraper: { width: 160, height: 600 }, // Skyscraper
        'wide-skyscraper': { width: 300, height: 600 } // Wide skyscraper
      }
    }
  },
  computed: {
    sizeClass() {
      return `ad-size-${this.size}`;
    }
  },
  methods: {
    dismissAd() {
      this.dismissed = true;
      // Could store this in localStorage to remember user preference
      // localStorage.setItem('adDismissed', 'true');
    }
  },
  mounted() {
    console.log('AdBanner mounted with size:', this.size);
    
    // For testing, let's always show the ad placeholder
    this.adLoaded = false;
    
    // In a real implementation, you would integrate with an ad provider here
    // Simulate ad loading with a timeout for real implementation
    // setTimeout(() => {
    //   this.adLoaded = true;
    // }, 1000);
    
    // Check if the ad was previously dismissed
    // const wasDismissed = localStorage.getItem('adDismissed') === 'true';
    // this.dismissed = wasDismissed;
  }
}
</script>

<style scoped>
.ad-banner-container {
  display: flex;
  justify-content: center;
  padding: 0;
  margin: 0;
  width: auto; /* Let the ad determine its own width */
  position: relative;
}

.ad-banner {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.95);
  border: 1px solid #bbbbbb;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  position: relative;
}

.dismiss-button {
  position: absolute;
  top: 2px;
  right: 2px;
  width: 20px;
  height: 20px;
  background-color: rgba(0, 0, 0, 0.2);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  cursor: pointer;
  z-index: 2;
  transition: background-color 0.2s;
}

.dismiss-button:hover {
  background-color: rgba(0, 0, 0, 0.4);
}

.ad-placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  color: #555;
  font-size: 1rem;
  font-weight: bold;
}

/* Standard ad sizes based on IAB standards */
.ad-size-leaderboard {
  width: 728px;
  height: 90px;
}

.ad-size-large-mobile {
  width: 320px;
  height: 100px;
}

.ad-size-medium-rectangle {
  width: 300px;
  height: 250px;
}

.ad-size-skyscraper {
  width: 160px;
  height: 600px;
}

.ad-size-wide-skyscraper {
  width: 300px;
  height: 600px;
}

/* Responsive behavior */
@media (max-width: 768px) {
  .ad-size-leaderboard {
    width: 320px;
    height: 100px;
  }
}

@media (max-width: 320px) {
  .ad-size-leaderboard, .ad-size-large-mobile {
    width: 300px;
    height: 100px;
  }
}
</style> 