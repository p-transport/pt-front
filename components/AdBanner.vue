<template>
  <div class="ad-banner-container">
    <div class="ad-banner" :class="sizeClass">
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
  mounted() {
    console.log('AdBanner mounted with size:', this.size);
    
    // For testing, let's always show the ad placeholder
    this.adLoaded = false;
    
    // In a real implementation, you would integrate with an ad provider here
    // Simulate ad loading with a timeout for real implementation
    // setTimeout(() => {
    //   this.adLoaded = true;
    // }, 1000);
  }
}
</script>

<style scoped>
.ad-banner-container {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 15px 0;
  background-color: #f0f0f0;
  border-top: 2px solid #cccccc;
  margin-top: auto; /* Push to bottom */
  position: relative; /* Ensure it's in the document flow */
  z-index: 10; /* Make sure it's above other elements */
}

.ad-banner {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #e0e0e0;
  border: 2px solid #bbbbbb;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
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