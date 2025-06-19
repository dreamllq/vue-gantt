<template>
  <div class='gantt-bar-grid'>
    <template v-for='item in lazyBarGrid' :key='item.id'>
      <div
        class='bar-cell gantt-bar-cell'
        :style='{
          top: `${item.sy}px`,
          left: `${item.sx}px`,
          width: `${item.width}px`,
          height: `${item.height}px`
        }'
        :data-id='item.id'
        :data-type='typeof item.id'
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { useBarGridHook } from './bar-grid-hook';

const { lazyBarGrid } = useBarGridHook();
</script>

<style scoped lang="scss">
.gantt-bar-grid {
  width: 0;
  left: 0;
  position: relative;

  .bar-cell {
    position: absolute;
    background-color: var(--el-color-primary-light-3);
  }
}
</style>