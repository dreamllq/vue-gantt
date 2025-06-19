<template>
  <div class='gantt-data-grid'>
    <template v-for='item in lazyGrid' :key='`${item.index}-${item.timeString}`'>
      <div
        class='grid-cell' 
        :style='{
          width: `${item.width}px`,
          height: `${item.height}px`,
          left: `${item.x}px`,
          top: `${item.y}px`
        }' 
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { useDateGridHook } from './date-grid-hook';

const { grid, lazyGrid } = useDateGridHook();
</script>

<style scoped lang="scss">
.gantt-data-grid {
  width: 100%;
  height: 100%;
  pointer-events: none;
  position: absolute;
  top: 0;
  left: 0;

  .grid-cell{
    position: absolute;
    border-bottom: 1px solid var(--border-color);
    border-right: 1px solid var(--border-color);
  }
}
</style>