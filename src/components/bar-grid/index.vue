<template>
  <div class='gantt-bar-grid'>
    <template v-for='item in lazyBarGrid' :key='item.id'>
      <div
        v-if='!item.dragging'
        class='bar-cell gantt-bar-cell'
        :class='barHtmlClass'
        :style='{
          width: `${item.width}px`,
          height: `${item.height}px`,
          transform: `translate(${item.sx}px, ${item.sy}px)`,
          zIndex: item.zIndex,
          "--bar-custom-color": item.color || "var(--bar-color)"
        }'
        :data-id='item.id'
        :data-type='getIdType(item.id)'>
        <slot :bar='item' />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useBarGridHook } from './bar-grid-hook';
import { useStore } from '../store';
import { BarId } from '@/types/gantt-bar';

const { barHtmlClass, ganttEntity } = useStore()!;
const { lazyBarGrid } = useBarGridHook();
const getIdType = (id:BarId) => (typeof id);
</script>

<style scoped lang="scss">
.gantt-bar-grid {
  width: 0;
  left: 0;
  position: absolute;
  top:0;

  .bar-cell {
    position: absolute;
    background-color: var(--bar-color);
    top: 0;
    left: 0;
    transition: transform 0.2s ease-in-out;
  }
}
</style>