<template>
  <div class="page-bg min-h-screen px-4 pb-16 pt-24">
    <div class="max-w-3xl mx-auto">
      <div class="bg-white p-8 lg:p-12 rounded-[2rem] shadow-sm">
        <h1 class="text-3xl font-bold mb-6">How to use</h1>
        <div class="prose prose-lg max-w-none" v-html="content"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { content, load } = useWpContent(484)
onMounted(load)
</script>

<style>
.prose img {
  max-width: 100%;
  height: auto;
}
</style>
