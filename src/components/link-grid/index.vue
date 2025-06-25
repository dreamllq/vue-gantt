<template>
  <show-all v-if='ganttEntity.config.linkShowStrategy === LinkShowStrategy.ALL' />
  <show-selected v-if='ganttEntity.config.linkShowStrategy === LinkShowStrategy.SELECTED' />
  <show-selected-all v-if='ganttEntity.config.linkShowStrategy === LinkShowStrategy.SELECTED_ALL' />
</template>

<script setup lang="ts">
import { LinkShowStrategy } from '@/types/gantt-link';
import { useStore } from '../store';
import ShowAll from './show-all.vue';
import ShowSelected from './show-selected.vue';
import ShowSelectedAll from './show-selected-all.vue';
const { ganttEntity } = useStore()!;
</script>

<style scoped>

</style>