<template>
  <div
    ref='containerRef'
    class='gantt-container'
    @wheel.prevent='scroll.onWheel'>
    <slot v-if='containerReady' />
  </div>
</template>

<script setup lang="ts">
import { useResizeObserver } from '@vueuse/core';
import { onMounted, ref } from 'vue';
// import bus from '@/utils/bus';
import { useStore } from './store';

const containerRef = ref();
const { container, scroll } = useStore()!;
const { containerReady } = container;

onMounted(() => {
  container.containerReady.value = false;
});

useResizeObserver(containerRef, (entries) => {
  const entry = entries[0];
  const { width, height } = entry.contentRect;
  console.log(`width: ${width}, height: ${height}`);
  container.setContainerSize({
    width,
    height 
  });

  
});
</script>

<style scoped lang="scss">
.gantt-container{
  position: relative;
  width: 100%;
  height: 100%;
}
</style>