<template>
  <div class='gantt-link-grid show-selected'>
    <template v-for='link in lazyLinkGrid' :key='`${link.id}_${link.selected}_${link.color}_${link.zIndex}`'>
      <l-path 
        v-if='!draggingBarIds.includes(link.sourceId) && !draggingBarIds.includes(link.targetId)'
        :link='link' 
        :z-index='link.zIndex'
        :selected='link.selected'
        :color='link.color'
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import LPath from './path.vue';
import { useShowSelectedHook } from './show-selected-hook';

const { lazyLinkGrid, draggingBarIds } = useShowSelectedHook();

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