<template>
  <select-render v-if='renderFlag' />
</template>

<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref } from 'vue';
import SelectRender from './render.vue';
import { Events } from '@/types';
import { useStore } from '../store';

const { bus } = useStore()!;
const renderFlag = ref(true);
const onDraggableChange = async () => {
  renderFlag.value = false;
  await nextTick();
  renderFlag.value = true;
};

onMounted(() => {
  bus.on(Events.SELECTABLE_CHANGE, onDraggableChange);
  bus.on(Events.CHECKABLE_CHANGE, onDraggableChange);
});

onUnmounted(() => {
  bus.off(Events.SELECTABLE_CHANGE, onDraggableChange);
  bus.off(Events.CHECKABLE_CHANGE, onDraggableChange);
});
</script>

<style scoped>

</style>