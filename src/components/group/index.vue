<template>
  <div class='gantt-group'>
    <group-layout v-slot='{data}'>
      <slot :data='data' />
    </group-layout>
  </div>
</template>

<script setup lang="ts">
import GroupLayout from './group-layout.vue';
</script>

<style scoped lang="scss">
.gantt-group{
  width: 100%;
  height: 100%;
  position: relative;
}
</style>