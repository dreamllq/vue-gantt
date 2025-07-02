<template>
  <div>
    <el-button @click='onHistoryBack'>
      back
    </el-button>
    <el-button @click='onHistoryNext'>
      next
    </el-button>
  </div>
  <el-button @click='changeDraggable'>
    changeDraggable
  </el-button>
  <el-button @click='changeSelectable'>
    changeSelectable
  </el-button>
  <el-button @click='setDataScaleUnit'>
    setDataScaleUnit
  </el-button>
  <el-button @click='setSizeRatioPercent'>
    setSizeRatioPercent
  </el-button>
  <el-button @click='removeBarById'>
    removeBarById
  </el-button>
  <el-button @click='addBar'>
    addBar
  </el-button>
  <el-button @click='updateBar'>
    updateBar
  </el-button>
  <el-button @click='removeLinkById'>
    removeLinkById
  </el-button>
  <el-button @click='addLink'>
    addLink
  </el-button>
  <el-button @click='setShowAttachedBars'>
    setShowAttachedBars
  </el-button>
  <el-button @click='setBarSelected'>
    setBarSelected
  </el-button>
  <el-button @click='setBarSelectable'>
    setBarSelectable
  </el-button>
  <el-button @click='setBarContextMenuEnable'>
    setBarContextMenuEnable
  </el-button>
  <el-button @click='setBarDraggable'>
    setBarDraggable
  </el-button>
  <el-button @click='scrollToGroup'>
    scrollToGroup
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

const setDataScaleUnit = () => {
  ganttRef.value?.api().setDataScaleUnit('WEEK');
};

const setSizeRatioPercent = () => {
  ganttRef.value?.api().setSizeRatioPercent(150);
};

const removeBarById = () => {
  ganttRef.value?.api().removeBarById(2);
};

const addBar = () => {
  ganttRef.value?.api().addBar({
    'duration': 72000,
    'end': null,
    'groupId': 2,
    'id': 2,
    'start': '2024-01-02 12:00:00',
    selectable: false 
  });
};

const updateBar = () => {
  ganttRef.value?.api().updateBar(2, {
    duration: 72000 * 2,
    groupId: 1,
    start: '2024-01-04 12:00:00',
    selectable: true,
    draggable: false
  });
};

const removeLinkById = () => {
  ganttRef.value?.api().removeLinkById(3);
};

const addLink = () => {
  ganttRef.value?.api().addLink({
    'id': 3,
    'sourceId': 4,
    'targetId': 5
  });
};

const setShowAttachedBars = () => {
  ganttRef.value?.api().setShowAttachedBars(false);
};

const setBarSelected = () => {
  ganttRef.value?.api().setBarSelected(4, true);
};

const setBarSelectable = () => {
  ganttRef.value?.api().setBarSelectable(4, false);
};
const setBarContextMenuEnable = () => {
  ganttRef.value?.api().setBarContextMenuEnable(1, true);
};
const onHistoryBack = () => {
  ganttRef.value!.api().history.back();
};

const onHistoryNext = () => {
  ganttRef.value!.api().history.next();
};

const setBarDraggable = () => {
  ganttRef.value?.api().setBarDraggable(1, true);
};

const scrollToGroup = () => {
  ganttRef.value?.api().scrollToGroup(12);
};
</script>

<style scoped>

</style>