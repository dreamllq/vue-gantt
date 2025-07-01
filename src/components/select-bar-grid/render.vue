<template>
  <single-select v-if='ganttEntity.config.selectable && !ganttEntity.config.multipleSelectable' />
  <multiple-select v-if='ganttEntity.config.selectable && ganttEntity.config.multipleSelectable' />
  <drag-rect-select v-if='ganttEntity.config.selectable && ganttEntity.config.multipleSelectable' />
</template>

<script setup lang="ts">
import { useStore } from '../store';
import SingleSelect from './single-select.vue';
import MultipleSelect from './multiple-select.vue';
import DragRectSelect from './drag-rect-select.vue';
import { useBarClickEventHook } from './bar-click-event-hook';

const { ganttEntity } = useStore()!;
useBarClickEventHook();
</script>

<style scoped>

</style>