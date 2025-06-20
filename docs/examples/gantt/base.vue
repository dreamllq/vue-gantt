<template>
  <div style='height: 400px;'>
    <gantt :data='data'>
      <template #aside-header>
        aaa
      </template>
      <template #bar='{bar}'>
        {{ bar.id }} \ {{ bar.selected }}
      </template>
    </gantt>
  </div>
</template>

<script setup lang="ts">
import { Gantt } from '@/index.ts';
import data from './data.json';

</script>

<style scoped>

</style>