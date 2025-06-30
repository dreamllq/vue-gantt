<template>
  <single-select v-if='ganttEntity.config.selectable && !ganttEntity.config.checkable' />
  <multiple-select v-else-if='ganttEntity.config.selectable && ganttEntity.config.checkable' />
</template>

<script setup lang="ts">
import { useStore } from '../store';
import SingleSelect from './single-select.vue';
import MultipleSelect from './multiple-select.vue';
import { useBarClickEventHook } from './bar-click-event-hook';

const { ganttEntity } = useStore()!;
useBarClickEventHook();
</script>

<style scoped>

</style>