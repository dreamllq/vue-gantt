<template>
  <div class='gantt-link-grid'>
    <svg :id='svgId' style='width: 100%; height: 100%;position: absolute;top: 0;left: 0; pointer-events: none;'>
      <path />
    </svg>
    <template v-for='link in lazyLinkGrid' :key='link.id'>
      <l-path 
        v-if='!draggingBarIds.includes(link.source.id) && !draggingBarIds.includes(link.target.id)'
        :link='link' 
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { useStore } from '../store';
import { useLinkGridHook } from './link-grid-hook';
import LPath from './path.vue';

const { ganttId } = useStore()!;
const svgId = `path-svg-${ganttId}`;
const { lazyLinkGrid, draggingBarIds } = useLinkGridHook();
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