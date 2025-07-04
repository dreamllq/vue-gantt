<template>
  <div
    class='gantt-milestones'
    :style='{
      zIndex: Number.MAX_SAFE_INTEGER
    }'>
    <template v-for='item in lazyMilestoneGrid' :key='item.id'>
      <milestone-item :item='item' />
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from '../store';
import { useMilestoneHook } from './hook';
import MilestoneItem from './milestone-item.vue';

const { ganttEntity, scroll, container } = useStore()!;
const { scrollLeft } = scroll;

const { lazyMilestoneGrid } = useMilestoneHook();
</script>

<style scoped lang="scss">
.gantt-milestones{
  position: absolute;
  top: 0;
  left: 0;


}
</style>