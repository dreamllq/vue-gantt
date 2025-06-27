<template>
  <div class='gantt-contextmenu-grid' />
</template>

<script setup lang="ts">
import { useContextmenuHook } from './contextmenu-hook';
import { useMenuHook } from './menu-hook';

useContextmenuHook();
useMenuHook();
</script>

<style scoped lang="scss">
.gantt-contextmenu-grid{
  width: 0;
  left: 0;
  position: absolute;
  top:0;
}
</style>