<template>
  <div v-if='scrollReady' class='gantt-scroll' :style='style'>
    <template v-if='renderFlag'>
      <scroll-x v-if='ganttEntity.scroll.hasX' />
      <scroll-y v-if='ganttEntity.scroll.hasY' />
    </template>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onBeforeMount, onMounted, ref } from 'vue';
import { useStore } from '../store';
import ScrollX from './scroll-x.vue';
import ScrollY from './scroll-y.vue';
import { Events } from '@/types/events';

const { scroll, ganttEntity, bus } = useStore()!;
const { scrollReady } = scroll;

const renderFlag = ref(true);

onMounted(() => {
  scroll.calculate();
  bus.on(Events.SCROLL_CHANGE, onScrollChange);
});

onBeforeMount(() => {
  bus.off(Events.SCROLL_CHANGE, onScrollChange);
});

const style = ref({
  '--scroll-width': `${ganttEntity.layoutConfig.SCROLL_WIDTH}px`,
  '--scroll-height': `${ganttEntity.layoutConfig.SCROLL_HEIGHT}px`
});
const onScrollChange = async () => {
  renderFlag.value = false;
  scroll.calculate();
  await nextTick();
  renderFlag.value = true;
};
</script>

<style scoped>

</style>