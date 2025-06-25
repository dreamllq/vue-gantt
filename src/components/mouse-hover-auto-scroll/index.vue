<template>
  <hover-scroll-render v-if='dragging' />
</template>

<script setup lang="ts">
import { useAutoScrollHook } from './auto-scroll-hook';
import HoverScrollRender from './render.vue';
const { dragging } = useAutoScrollHook();
</script>

<style scoped>

</style>