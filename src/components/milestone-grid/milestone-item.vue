<template>
  <el-tooltip
    class='box-item'
    effect='light'
    :content='item.text'
    placement='top'
  >
    <template v-if='item.x- (ganttEntity.layoutConfig.MILESTONE_WIDTH/2) < leftBoundary '>
      <div
        class='milestone-item shadow' 
        :style='{ 
          ...style,
          left: `${leftBoundary}px`
        }' />
    </template>
    <template v-else-if='item.x- (ganttEntity.layoutConfig.MILESTONE_WIDTH/2) > rightBoundary '>
      <div
        class='milestone-item shadow' 
        :style='{ 
          ...style,
          left: `${rightBoundary}px`,
        }' />
    </template>
    <template v-else>
      <div
        class='milestone-item' 
        :style='{ 
          ...style,
          left: `${item.x - (ganttEntity.layoutConfig.MILESTONE_WIDTH/2)}px`,
        }' />
    </template>
  </el-tooltip>
</template>

<script setup lang="ts">
import { computed, PropType } from 'vue';
import { useStore } from '../store';
import { GanttMilestoneView } from '../../models/gantt-milestone-view';

const props = defineProps({
  item: {
    type: Object as PropType<ReturnType<typeof GanttMilestoneView.prototype.toUiJSON>>,
    required: true
  }
});

const { ganttEntity, scroll } = useStore()!;
const { scrollLeft } = scroll;

const leftBoundary = computed(() => scrollLeft.value + (ganttEntity.layoutConfig.MILESTONE_WIDTH * 0.5));
const rightBoundary = computed(() => scrollLeft.value + ganttEntity.container.width - ganttEntity.layoutConfig.GRID_CELL_WIDTH - (ganttEntity.layoutConfig.MILESTONE_WIDTH * 2));

const style = computed(() => ({
  top: `${props.item.y - (ganttEntity.layoutConfig.MILESTONE_WIDTH / 2)}px`,
  width: `${ganttEntity.layoutConfig.MILESTONE_WIDTH}px`,
  height: `${ganttEntity.layoutConfig.MILESTONE_WIDTH}px`
}));

</script>

<style scoped lang="scss">
  .milestone-item{
    position: absolute;
    box-sizing: border-box;
    user-select: none;
    background-color: var(--el-color-error);
    transform: rotate(45deg);
    border: 1px solid #FFFFFF;

    &.shadow{
      border: 1px dotted var(--el-color-primary);
      opacity: 0.7;
    }
  }
</style>