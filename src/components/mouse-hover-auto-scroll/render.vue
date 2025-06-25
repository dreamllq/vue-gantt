<template>
  <div ref='target' class='mouse-hover-scroll'>
    <div>{{ Math.floor(elementX) }} / {{ Math.floor(elementY) }} / {{ isOutside }}</div>
    <div v-if='ganttEntity.scroll.hasY && scrollTop > 0' class='scroll-top' />
    <div v-if='ganttEntity.scroll.hasY && scrollTop < ganttEntity.scroll.yScrollBarHeight - ganttEntity.scroll.yScrollHeight' class='scroll-bottom' />

    <div v-if='ganttEntity.scroll.hasX && scrollLeft > 0' class='scroll-left' />
    <div v-if='ganttEntity.scroll.hasX && scrollTop < ganttEntity.scroll.xScrollBarWidth - ganttEntity.scroll.xScrollWidth' class='scroll-right' />
  </div>
</template>

<script setup lang="ts">
import { useStore } from '../store';
import { useMouseInElement } from '@vueuse/core';
import { ref } from 'vue';

const target = ref<HTMLDivElement>();

const { x, y, isOutside, elementX, elementY } = useMouseInElement(target);
const { scroll, ganttEntity } = useStore()!;
const { scrollLeft, scrollTop } = scroll;

</script>

<style scoped lang="scss">
.mouse-hover-scroll{
  width: 100%;
  height: 100%;
}
</style>