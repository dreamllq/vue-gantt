<template>
  <div
    ref='containerRef'
    class='gantt-container'
    @wheel.prevent='scroll.onWheel'
    @click='drag.onClick'
    @mousedown='drag.onMouseDown'
    @mouseup='drag.onMouseUp'
    @mousemove='drag.onMouseMove'>
    <slot v-if='containerReady' />
  </div>
</template>

<script setup lang="ts">
import { useResizeObserver } from '@vueuse/core';
import { onMounted, ref } from 'vue';
import { useStore } from './store';

const containerRef = ref();
const { container, scroll, drag } = useStore()!;
const { containerReady } = container;

onMounted(() => {
  container.containerReady.value = false;
});

useResizeObserver(containerRef, (entries) => {
  const entry = entries[0];
  const { width, height } = entry.contentRect;
  console.log(`container ## width: ${width}, height: ${height}`);
  container.setSize({
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
  border: 1px solid var(--border-color);
}
</style>