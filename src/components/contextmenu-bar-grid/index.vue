<template>
  <contextmenu-render v-if='ganttEntity.config.contextMenuEnable' />
</template>

<script setup lang="ts">
import { useStore } from '../store';
import ContextmenuRender from './render.vue';

const { ganttEntity } = useStore()!;
</script>

<style scoped>

</style>