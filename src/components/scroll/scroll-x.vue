<template>
  <div
    ref='scrollXRef'
    class='gantt-scroll-x'
    :style='{width: `${ganttEntity.scroll.xScrollWidth}px`, height: `var(--scroll-height)`}'
    @scroll='onScrollX'>
    <div class='gantt-scroll-x-bar' :style='{width: `${ganttEntity.scroll.xScrollBarWidth}px`, height: `var(--scroll-height)` }' />
  </div>
</template>

<script setup lang="ts">
import { debounce } from 'lodash';
import { useStore } from '../store';
import { ref, watch } from 'vue';

const { ganttEntity, scroll } = useStore()!;

const { scrollLeft } = scroll;
const scrollXRef = ref();

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