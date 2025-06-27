<template>
  <div class='gantt-single-drag'>
    <div
      v-if='shadowDraggingBar && draggingBar'
      class='dragging-bar-cell-shadow' 
      :style='{
        width: `${shadowDraggingBar.width}px`,
        height: `${shadowDraggingBar.height}px`,
        transform: `translate(${shadowDraggingBar.sx}px, ${shadowDraggingBar.sy}px)`
      }' />
    <div
      v-if='draggingBar'
      class='dragging-bar-cell' 
      :style='{
        width: `${draggingBar.width}px`,
        height: `${draggingBar.height}px`,
        transform: `translate(${draggingBar.sx}px, ${draggingBar.sy}px)`
      }'
    >
      <slot :bar='ganttEntity.bars.getById(draggingBar.id)!' />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStore } from '../store';
import { useSingleDraggingHook } from './single-dragging-hook';

const { ganttEntity } = useStore()!;
const { draggingBar, shadowDraggingBar } = useSingleDraggingHook();
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
    opacity: 0.5;
    top: 0;
    left: 0;
  }

  .dragging-bar-cell-shadow{
    position: absolute;
    background-color: var(--el-color-primary-light-9);
    border: 2px dashed var(--el-color-primary);
    top: 0;
    left: 0;
    transition: transform 0.3s linear
  }
}
</style>