<template>
  <div style='height: 400px;'>
    <gantt :data='data' />
  </div>
</template>

<script setup lang="ts">
import { Gantt } from '@/index.ts';
import data from './data.json';

</script>

<style scoped>

</style>