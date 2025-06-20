<template>
  <single-drag>
    <template #default='slotProps'>
      <slot name='draggingBar' v-bind='slotProps' />
    </template>
  </single-drag>
</template>

<script setup lang="ts">
import SingleDrag from './single-drag.vue';
</script>

<style scoped>

</style>