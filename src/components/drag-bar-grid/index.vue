<template>
  <drag-render v-if='renderFlag' />
</template>

<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref } from 'vue';
import { useStore } from '../store';
const { bus } = useStore()!;
import DragRender from './render.vue';
import { Events } from '@/types/events';

const renderFlag = ref(true);
const onDraggableChange = async () => {
  renderFlag.value = false;
  await nextTick();
  renderFlag.value = true;
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