<template>
  <single-drag v-if='ganttEntity.config.draggable && !ganttEntity.config.multipleDraggable'>
    <template #default='slotProps'>
      <slot name='draggingBar' v-bind='slotProps' />
    </template>
  </single-drag>
</template>

<script setup lang="ts">
import { useStore } from '../store';
import { useBarDragEvent } from './bar-drag-event-hook';
import SingleDrag from './single-drag.vue';
const { ganttEntity } = useStore()!;

useBarDragEvent();
</script>

<style scoped>

</style>