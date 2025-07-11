<template>
  <div style='height: 600px;'>
    <gantt-view
      ref='ganttRef' 
      :data='ganttData'
      @ready='onReady'
    >
      <template #aside-header>
        aaa
      </template>
      <template #group='{group}'>
        {{ group.id }} / {{ group.deep }}
      </template>
      <template #bar='{bar}'>
        {{ bar.id }} 
      </template>
      <template #attachedBar='{bar}'>
        {{ bar.id }} 
      </template>
    </gantt-view>
  </div>
</template>

<script setup lang="ts">
import { GanttView, GanttJsonData, GanttViewInstance } from '@/index.ts';
// import { data } from './data.ts';
import { ref } from 'vue';
import { getData } from './data';
const data = getData();
console.log(data);

const ganttData = ref<GanttJsonData>(data);
const ganttRef = ref<GanttViewInstance>();

const onReady = () => {
  console.log('ready');
};

</script>

<style scoped>

</style>