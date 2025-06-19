<template>
  <div class='gantt-group-layout'>
    <template v-for='item in lazyGroup' :key='item.index'>
      <div
        class='group-item'
        :style='{
          height: `${ganttEntity.layoutConfig.ROW_HEIGHT}px`,
          top: `${item.index * ganttEntity.layoutConfig.ROW_HEIGHT}px`
        }'
      >
        <slot :data='item.group'>
          {{ item.group.id }}
        </slot>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useStore } from '../store';
import { useGroupHook } from './group-hook';

const { ganttEntity } = useStore()!;
const { lazyGroup } = useGroupHook();
</script>

<style scoped lang="scss">
.gantt-group-layout{
  position: relative;
  width: 100%;
  height: 100%;

  .group-item{
    position: absolute;
    border-bottom: 1px solid var(--border-color);
    width: 100%;
  }
}
</style>