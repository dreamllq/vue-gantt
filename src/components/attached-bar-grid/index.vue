<template>
  <div class='gantt-attached-bar-grid'>
    <template v-for='item in lazyAttachedBarGrid' :key='item.id'>
      <div
        class='attach-bar-cell gantt-bar-cell'
        :style='{
          width: `${item.width}px`,
          height: `${item.height}px`,
          transform: `translate(${item.sx}px, ${item.sy}px)`
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
    top: 0;
    left: 0;
    transition: transform 0.2s ease-in-out;
  }
}
</style>