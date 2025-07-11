<template>
  <div>
    <el-button @click='onHistoryBack'>
      back
    </el-button>
    <el-button @click='onHistoryNext'>
      next
    </el-button>
    <el-button @click='changeHeight'>
      changeHeight
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
  <el-button @click='scrollToDatetime'>
    scrollToDatetime
  </el-button>
  <el-button @click='getSelectedBarIds'>
    getSelectedBarIds
  </el-button>
  <el-button @click='getJSON'>
    getJSON
  </el-button>
  
  <div :style='{height: `${height}px`}'>
    <gantt-view
      ref='ganttRef' 
      :data='ganttData'
      :hook='hook'
      @bar-drag-change='onBarDragChange'
      @ready='onReady'
    >
      <template #aside-header>
        aaa
      </template>
      <template #group='{group}'>
        {{ group.id }} / {{ group.deep }}
      </template>
      <template #bar='{bar}'>
        {{ bar.id }} \ {{ bar.selected }} \ {{ bar.rowIndex }}
      </template>
      <template #attachedBar='{bar}'>
        {{ bar.id }} \ {{ bar.rowIndex }}
      </template>
    </gantt-view>
  </div>
</template>

<script setup lang="ts">
import { GanttView, GanttJsonData, GanttViewInstance } from '@/index.ts';
import { data } from './a.ts';
import { ref } from 'vue';

const ganttData = ref<GanttJsonData>(data);
const ganttRef = ref<GanttViewInstance>();
const height = ref(400);

const hook = {
  beforeDragStart: (data) => true,
  beforeDragEnd: (data) => true
};


let draggable = ganttData.value.config.draggable;

const changeHeight = () => {
  height.value = 300;
};
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
  ganttRef.value?.api().setDataScaleUnit('DAY');
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
  ganttRef.value?.api().scrollToGroup(4);
};

const scrollToDatetime = () => {
  ganttRef.value?.api().scrollToDatetime('2024-01-04 11:00:00');
};

const getSelectedBarIds = () => {
  const selectedIds = ganttRef.value!.api().getSelectedBarIds();
  console.log(selectedIds);
  const bars = selectedIds.map(id => {
    if (id) {
      return ganttRef.value?.api().getBarById(id);
    } else {
      return undefined;
    }
  });

  console.log(bars);
};

const onBarDragChange = (ids) => {
  console.log('onBarDragChange', ids);
};

const getJSON = () => {
  console.log(ganttRef.value?.api().getJSON());
};

const onReady = () => {
  console.log('ready');
};
</script>

<style scoped>

</style>