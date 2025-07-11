<template>
  <drag-render v-if='renderFlag'>
    <template #draggingBar='slotProps'>
      <slot name='draggingBar' v-bind='slotProps' />
    </template>
  </drag-render>
</template>

<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref } from 'vue';
import { useStore } from '../store';
import DragRender from './render.vue';
import { Events } from '@/types/events';

const { bus, ganttEntity } = useStore()!;
const renderFlag = ref(true);

const onDraggableChange = async () => {
  renderFlag.value = false;
  await nextTick();
  renderFlag.value = ganttEntity.config.draggable || ganttEntity.config.multipleDraggable;
};

onMounted(() => {
  bus.on(Events.DRAGGABLE_CHANGE, onDraggableChange);
});

onUnmounted(() => {
  bus.off(Events.DRAGGABLE_CHANGE, onDraggableChange);
});
</script>

<style scoped>

</style>