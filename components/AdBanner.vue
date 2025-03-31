<template>
  <div v-if="!dismissed" class="ad-banner-container">
    <div class="ad-banner" :class="sizeClass">
      <a href="https://publictransport.tourdesk.is/Transportation/Transfer?searchParameter=%22airport%20direct%22%20%22flybus%22" target="_blank" rel="noopener noreferrer" class="ad-link-area">
        <span class="ad-link-text">Book airport transfer</span>
      </a>
      <div class="dismiss-button" @click.stop="dismissAd">
        <span>&times;</span>
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
  /* Updated background: blue gradient */
  background-image: linear-gradient(to bottom, #007bff, #0056b3);
  border: 1px solid #0056b3; /* Adjusted border */
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  border-radius: 0px;
  position: relative;
  text-align: center;
}

.dismiss-button {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 22px; /* Slightly larger */
  height: 22px;
  background-color: rgba(255, 255, 255, 0.8); /* More opaque */
  color: #0056b3; /* Blue color */
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px; /* Larger icon */
  font-weight: bold;
  cursor: pointer;
  z-index: 2; /* Ensure it's above the link area */
  transition: background-color 0.2s, color 0.2s;
}

.dismiss-button:hover {
  background-color: rgba(255, 255, 255, 1);
  color: #003d80;
}

.ad-link-area {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  z-index: 1; /* Below dismiss button */
}

.ad-link-text {
  /* Style for the white strip effect, applied to the span */
  background-color: #ffffff;
  color: #0056b3; /* Blue text for contrast */
  padding: 8px 20px; /* Padding to create the strip size */
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  
  /* Font styling */
  font-size: 1.2rem; 
  font-weight: bold;
  transition: opacity 0.2s; /* Add transition to text */
}

.ad-link-area:hover .ad-link-text {
  opacity: 0.85; /* Slight visual feedback on hover */
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
    width: 320px; /* Adjust leaderboard to a common mobile banner size */
    height: 100px;
  }
  .ad-link-text {
     font-size: 1rem; /* Adjust font size for smaller screens */
     padding: 6px 15px; /* Adjust padding */
  }
}

@media (max-width: 320px) {
  .ad-size-leaderboard, .ad-size-large-mobile {
    width: 300px; /* Adjust for very small screens */
    height: 100px;
  }
   .ad-link-text {
     font-size: 0.9rem; /* Further reduce font size */
     padding: 5px 12px; /* Adjust padding */
  }
}
</style> 