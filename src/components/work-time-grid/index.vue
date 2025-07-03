<template>
  <div class='gantt-work-time-grid'>
    <template v-for='item in lazyWorkTimeGrid' :key='item.id'>
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
import { useWorkTimeGridHook } from './work-time-grid-hook';

const { lazyWorkTimeGrid } = useWorkTimeGridHook();
</script>

<style scoped lang="scss">
.gantt-work-time-grid {
  width: 100%;
  height: 100%;
  pointer-events: none;
  position: absolute;
  top: 0;
  left: 0;

  .grid-cell{
    position: absolute;
    background-color: #fff;
  }
}
</style>