<template>
  <show-all v-if='ganttEntity.config.linkShowStrategy === LinkShowStrategy.ALL' />
</template>

<script setup lang="ts">
import { LinkShowStrategy } from '@/types/gantt-link';
import { useStore } from '../store';
import ShowAll from './show-all.vue';
const { ganttEntity } = useStore()!;
</script>

<style scoped>

</style>