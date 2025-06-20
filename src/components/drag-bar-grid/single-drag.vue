<template>
  <div class='gantt-single-drag'>
    <div
      v-if='draggingBar'
      class='dragging-bar-cell' 
      :style='{
        top: `${draggingBar.sy}px`,
        left: `${draggingBar.sx}px`,
        width: `${draggingBar.width}px`,
        height: `${draggingBar.height}px`
      }'
    >
      <slot :bar='ganttEntity.bars.getById(draggingBar.id)' />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStore } from '../store';
import { useSingleDraggingHook } from './single-dragging-hook';

const { ganttEntity } = useStore()!;
const { draggingBar } = useSingleDraggingHook();
</script>

<style scoped lang="scss">
.gantt-single-drag{
  width: 0;
  left: 0;
  position: absolute;
  top:0;
  left: 0;

  .dragging-bar-cell {
    position: absolute;
    background-color: var(--el-color-primary-light-3);
    opacity: 0.7;
  }
}
</style>