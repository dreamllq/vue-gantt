<template>
  <el-button @click='changeDraggable'>
    changeDraggable
  </el-button>
  <el-button @click='changeSelectable'>
    changeSelectable
  </el-button>
  <div style='height: 400px;'>
    <gantt-view ref='ganttRef' :data='ganttData'>
      <template #aside-header>
        aaa
      </template>
      <template #group='{group}'>
        {{ group.id }} / {{ group.deep }}
      </template>
      <template #bar='{bar}'>
        {{ bar.id }} \ {{ bar.selected }} \ {{ bar.rowIndex }} \ {{ bar.group.id }}
      </template>
      <template #attachedBar='{bar}'>
        {{ bar.id }} \ {{ bar.rowIndex }}
      </template>
    </gantt-view>
  </div>
</template>

<script setup lang="ts">
import { GanttView, GanttJsonData, GanttViewInstance } from '@/index.ts';
import { data } from './data.ts';
import { ref } from 'vue';

const ganttData = ref<GanttJsonData>(data);
const ganttRef = ref<GanttViewInstance>();

let draggable = ganttData.value.config.draggable;
const changeDraggable = () => {
  draggable = !draggable;
  ganttRef.value!.api().setDraggable(draggable);
};

let selectable = ganttData.value.config.selectable;
const changeSelectable = () => {
  selectable = !selectable;
  ganttRef.value!.api().setSelectable(selectable);
};
</script>

<style scoped>

</style>