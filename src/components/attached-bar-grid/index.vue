<template>
  <div class='gantt-attached-bar-grid'>
    <template v-for='item in lazyAttachedBarGrid' :key='item.id'>
      <div
        class='attach-bar-cell gantt-bar-cell'
        :style='{
          top: `${item.sy}px`,
          left: `${item.sx}px`,
          width: `${item.width}px`,
          height: `${item.height}px`
        }'>
        <slot :bar='item' />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useAttachedBarHook } from './attached-bar-grid-hook';

const { lazyAttachedBarGrid } = useAttachedBarHook();
</script>

<style scoped lang="scss">
.gantt-attached-bar-grid {
  width: 0;
  left: 0;
  position: absolute;
  top:0;

  .attach-bar-cell {
    position: absolute;
    background-color: var(--bar-color);
    opacity: 0.7;
  }
}
</style>