<template>
  <div
    ref='containerRef'
    class='gantt-container'
    @wheel.prevent.stop='scroll.onWheel'
    @mousedown.prevent='drag.onMouseDown'
    @mouseup.prevent='drag.onMouseUp'
    @mousemove.prevent='drag.onMouseMove'>
    <slot v-if='containerReady' />
  </div>
</template>

<script setup lang="ts">
import { useResizeObserver, useMouseInElement } from '@vueuse/core';
import { onMounted, ref, watch } from 'vue';
import { useStore } from './store';

const containerRef = ref();
const { container, scroll, drag, bus } = useStore()!;
const { containerReady } = container;

const { isOutside } = useMouseInElement(containerRef);

watch(isOutside, () => {
  if (isOutside.value === true) {
    bus.emit('mouse-outside');
  }
}, { immediate: true });

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