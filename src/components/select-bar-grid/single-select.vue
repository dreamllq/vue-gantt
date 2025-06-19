<template>
  <div class='gantt-single-select' />
</template>

<script setup lang="ts">
import { useSingleSelectHook } from './single-select-hook';

useSingleSelectHook();
</script>

<style scoped lang="scss">
.gantt-single-select{
  width: 0;
  left: 0;
  position: relative;
}
</style>