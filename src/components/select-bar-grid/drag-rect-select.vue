<template>
  <div class='drag-rect-select'>
    <div v-if='dragging' class='rect-drag' :style='rectDragStyle' />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useDragRectSelectHook } from './drag-rect-select-hook';

const { dragRect, dragging } = useDragRectSelectHook();

const rectDragStyle = computed(() => ({
  top: `${Math.min(dragRect.value.sy, dragRect.value.ey)}px`,
  left: `${Math.min(dragRect.value.sx, dragRect.value.ex)}px`,
  width: `${Math.abs(dragRect.value.ex - dragRect.value.sx)}px`,
  height: `${Math.abs(dragRect.value.ey - dragRect.value.sy)}px`
}));
</script>

<style lang="scss" scoped>
.drag-rect-select {
  position: absolute;
  top: 0;
  left: 0;
  user-select: none;
  pointer-events: none;
}

.rect-drag {
  border: 2px dashed var(--drag-rect-border-color);
  position: absolute;
}
</style>