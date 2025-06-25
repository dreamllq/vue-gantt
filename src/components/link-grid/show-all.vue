<template>
  <div class='gantt-link-grid show-all'>
    <svg :id='svgId' style='width: 100%; height: 100%;position: absolute;top: 0;left: 0; pointer-events: none;'>
      <path />
    </svg>
    <template v-for='link in lazyLinkGrid' :key='link.id'>
      <l-path 
        v-if='!draggingBarIds.includes(link.sourceId) && !draggingBarIds.includes(link.targetId)'
        :link='link' 
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { useStore } from '../store';
import LPath from './path.vue';
import { useShowAllHook } from './show-all-hook';

const { ganttId } = useStore()!;
const svgId = `path-svg-${ganttId}`;
const { lazyLinkGrid, draggingBarIds } = useShowAllHook();

</script>

<style scoped lang="scss">
.gantt-link-grid{
  width: 100%;
  height: 100%;
  pointer-events: none;
  left: 0;
  position: absolute;
  top:0;

}
</style>