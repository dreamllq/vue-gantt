<template>
  <div
    ref='scrollXRef'
    class='gantt-scroll-x'
    :style='style'
    @scroll='onScrollX'>
    <div class='gantt-scroll-x-bar' :style='barStyle' />
  </div>
</template>

<script setup lang="ts">
import { debounce } from 'lodash';
import { useStore } from '../store';
import { onBeforeMount, onMounted, ref, watch } from 'vue';
import { Events } from '@/types/events';

const { ganttEntity, scroll, bus } = useStore()!;

const { scrollLeft } = scroll;
const scrollXRef = ref();

const style = ref({
  width: `${ganttEntity.scroll.xScrollWidth}px`,
  height: 'var(--scroll-height)'
});

const barStyle = ref({
  width: `${ganttEntity.scroll.xScrollBarWidth}px`,
  height: 'var(--scroll-height)'
});

watch(scrollLeft, (val) => {
  scrollXRef.value.scrollLeft = val;
});

let tempX: number;
const updateScrollX = debounce(() => {
  scrollLeft.value = tempX;
}, 0);

function onScrollX(e) {
  tempX = e.target.scrollLeft;
  updateScrollX();
}

const onScrollChange = () => {
  style.value.width = `${ganttEntity.scroll.xScrollWidth}px`;
  barStyle.value.width = `${ganttEntity.scroll.xScrollBarWidth}px`;
};

onMounted(() => {
  bus.on(Events.SCROLL_CHANGE, onScrollChange);
});

onBeforeMount(() => {
  bus.off(Events.SCROLL_CHANGE, onScrollChange);
});
</script>

<style scoped lang="scss">
.gantt-scroll-x {
  position: absolute;
  left: 0;
  bottom: 0;
  overflow-x: auto;
  overflow-y: hidden;
  z-index: 1999;
}
</style>