<template>
  <div class='current-time' :style='style' />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useStore } from '../store';
import { dateDiff } from '@/utils/date-diff';
import { strToDate } from '@/utils/to-date';
import { Unit } from '@/types/unit';

const { ganttEntity } = useStore()!;

const style = ref({ left: `${dateDiff(new Date(), strToDate(ganttEntity.config.start), Unit.SECOND) * ganttEntity.config.secondWidth}px` });

</script>

<style lang="scss" scoped>
.current-time {
  position: absolute;
  border: 1px dashed var(--el-color-primary);
  top: 0;
  pointer-events: none;
  height: 100%;

  &::before {
    content: "";
    position: absolute;
    width: 8px;
    height: 8px;
    background: var(--el-color-primary);
    border-radius: 8px;
    left: -4px;
    top: -.5px;
  }
}
</style>