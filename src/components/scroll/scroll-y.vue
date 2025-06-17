<template>
  <div
    ref='scrollYRef'
    class='gantt-scroll-y'
    :style='{
      top: `${ganttEntity.layoutConfig.HEADER_HEIGHT}px`,
      height: `${ganttEntity.scroll.yScrollHeight}px`,
      width: `var(--scroll-width)`
    }'
    @scroll='onScrollY'>
    <div class='gantt-scroll-y-bar' :style='{height: `${ganttEntity.scroll.yScrollBarHeight}px`, width: `var(--scroll-width)`}' />
  </div>
</template>

<script setup lang="ts">
import { debounce } from 'lodash';
import { useStore } from '../store';
import { ref, watch } from 'vue';

const { ganttEntity, scroll } = useStore()!;
const { scrollTop } = scroll;

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