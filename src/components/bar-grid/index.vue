<template>
  <div class='gantt-bar-grid'>
    <template v-for='item in lazyBarGrid' :key='item.id'>
      <div
        v-if='!item.dragging'
        class='bar-cell gantt-bar-cell'
        :style='{
          top: `${item.sy}px`,
          left: `${item.sx}px`,
          width: `${item.width}px`,
          height: `${item.height}px`
        }'
        :data-id='item.id'
        :data-type='getIdType(item.id)'>
        <slot :bar='item' />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { Id } from '@/types/id';
import { useBarGridHook } from './bar-grid-hook';

const { lazyBarGrid } = useBarGridHook();
const getIdType = (id:Id) => (typeof id);
</script>

<style scoped lang="scss">
.gantt-bar-grid {
  width: 0;
  left: 0;
  position: absolute;
  top:0;
  left: 0;

  .bar-cell {
    position: absolute;
    background-color: var(--bar-color);
  }
}
</style>