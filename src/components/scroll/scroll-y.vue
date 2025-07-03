<template>
  <div
    ref='scrollYRef'
    class='gantt-scroll-y'
    :style='style'
    @scroll='onScrollY'>
    <div class='gantt-scroll-y-bar' :style='barStyle' />
  </div>
</template>

<script setup lang="ts">
import { debounce } from 'lodash';
import { useStore } from '../store';
import { onBeforeMount, onMounted, ref, watch } from 'vue';
import { Events } from '@/types/events';

const { ganttEntity, scroll, bus } = useStore()!;
const { scrollTop } = scroll;

const style = ref({
  top: `${ganttEntity.layoutConfig.HEADER_HEIGHT}px`,
  height: `${ganttEntity.scroll.yScrollHeight}px`,
  width: 'var(--scroll-width)'
});

const barStyle = ref({
  height: `${ganttEntity.scroll.yScrollBarHeight}px`,
  width: 'var(--scroll-width)'
});

const scrollYRef = ref();

watch(scrollTop, (val) => {
  scrollYRef.value.scrollTop = val;
});

let tempY: number;
const updateScrollY = debounce(() => {
  scrollTop.value = tempY;
}, 0);

function onScrollY(e) {
  tempY = e.target.scrollTop;
  updateScrollY();
}

// const onScrollChange = () => {
//   scroll.calculate();
//   style.value.height = `${ganttEntity.scroll.yScrollHeight}px`;
//   barStyle.value.height = `${ganttEntity.scroll.yScrollBarHeight}px`;
// };

// onMounted(() => {
//   bus.on(Events.SCROLL_CHANGE, onScrollChange);
// });

// onBeforeMount(() => {
//   bus.off(Events.SCROLL_CHANGE, onScrollChange);
// });

</script>

<style scoped lang="scss">
.gantt-scroll-y {
  position: absolute;
  right: 0;
  overflow-x: hidden;
  overflow-y: auto;
  z-index: 1999;
}
</style>