<template>
  <div class='gantt-contextmenu-grid'>
    <vue3-menus
      v-model:open='isOpen'
      :event='eventVal'
      :menus='menus'
      :z-index='menusZIndex'
      has-icon />
  </div>
</template>

<script setup lang="ts">
import { useContextmenuHook } from './contextmenu-hook';
import { useMenuHook } from './menu-hook';
import { Vue3Menus } from 'vue3-menus';

useContextmenuHook();
const { menus, eventVal, isOpen, menusZIndex } = useMenuHook();
</script>

<style scoped lang="scss">
.gantt-contextmenu-grid{
  width: 0;
  left: 0;
  position: absolute;
  top:0;
}
</style>