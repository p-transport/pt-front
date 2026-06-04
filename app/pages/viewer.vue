<template>
  <div class="viewer-container">
    <iframe v-if="url" :src="url" class="pdf-frame" />
    <div v-else class="flex items-center justify-center h-full text-gray-500">
      No document specified.
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const url = computed(() => route.query.url || null)
</script>

<style scoped>
.viewer-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding-top: calc(80px + env(safe-area-inset-top, 0px));
}

.pdf-frame {
  width: 100%;
  height: 100%;
  border: none;
}
</style>
