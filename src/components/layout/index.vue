<template>
  <div class='gantt-layout'>
    <div class='gantt-aside vertical' :style='asideStyle'>
      <div class='gantt-header' :style='headerStyle'>
        <slot name='aside-header' />
      </div>
      <div class='gantt-main'>
        <slot name='aside-main' />
      </div>
    </div>
    <div class='gantt-main vertical'>
      <div class='gantt-header' :style='headerStyle'>
        <slot name='main-header' />
      </div>
      <div class='gantt-main'>
        <slot name='main-main' />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useStore } from '../store';

const { ganttEntity } = useStore()!;
const asideStyle = ref({ width: `${ganttEntity.layoutConfig.GRID_CELL_WIDTH}px` });
const headerStyle = ref({ height: `${ganttEntity.layoutConfig.HEADER_HEIGHT}px` });
</script>

<style scoped lang="scss">
.gantt-layout {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  background-color: var(--el-fill-color-blank);
  display: flex;


    .vertical{
      flex-direction: column;
    }

  .gantt-aside {
    flex: none;
    overflow: hidden;
    display: flex;
    height: 100%;

    .vertical{
      .gantt-main{
        height: auto;
        width: 100%;
      }
    }
  }

  .gantt-main{
    flex: 1;
    overflow: hidden;
    display: flex;
    height: 100%;

    .vertical{
      .gantt-main{
        height: auto;
        width: 100%;
      }
    }
  }

  .gantt-header{
    flex: none;
    overflow: hidden;
    width: 100%;
  }

}
</style>