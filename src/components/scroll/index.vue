<template>
  <div v-if='scrollReady' class='gantt-scroll' :style='style'>
    <scroll-x v-if='ganttEntity.scroll.hasX' />
    <scroll-y v-if='ganttEntity.scroll.hasY' />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useStore } from '../store';
import ScrollX from './scroll-x.vue';
import ScrollY from './scroll-y.vue';


const { scroll, ganttEntity } = useStore()!;
const { scrollReady } = scroll;
onMounted(() => {
  scroll.calculate();
});

const style = ref({
  '--scroll-width': `${ganttEntity.layoutConfig.SCROLL_WIDTH}px`,
  '--scroll-height': `${ganttEntity.layoutConfig.SCROLL_HEIGHT}px`
});
</script>

<style scoped>

</style>