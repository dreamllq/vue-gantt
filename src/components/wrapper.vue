<template>
  <container v-if='entityReady'>
    <layout v-if='scrollReady'>
      <template #aside-header>
        <slot name='aside-header'>
          GANTT
        </slot>
      </template>
      <template #aside-main>
        <group>
          <template #default='slotProps'>
            <slot name='group' v-bind='slotProps' />
          </template>
        </group>
      </template>
      <template #main-header>
        <time-line />
      </template>
      <template #main-main>
        <date-grid-bg />
        <work-time-grid />
        <date-grid />
        <current-time v-if='ganttEntity.config.showCurrentTimeLine' />
        <bar-grid>
          <template #default='slotProps'>
            <slot name='bar' v-bind='slotProps' />
          </template>
        </bar-grid>
        <attached-bar-grid v-if='ganttEntity.config.showAttachedBar'>
          <template #default='slotProps'>
            <slot name='attachedBar' v-bind='slotProps' />
          </template>
        </attached-bar-grid>
        
        <select-bar-grid />
        <contextmenu-bar-grid />
        <link-grid v-if='ganttEntity.config.linkShowStrategy !== LinkShowStrategy.NONE' />
      </template>
      <template #main>
        <drag-bar-grid>
          <template #draggingBar='slotProps'>
            <slot name='bar' v-bind='slotProps' />
          </template>
        </drag-bar-grid>
        <bar-tip-grid />
      </template>
      <template #main-main-layer>
        <mouse-hover-auto-scroll />
      </template>
    </layout>
    <scroll />
  </container>
</template>

<script setup lang="ts">
import Container from './container.vue';
import { useStore } from './store';
import Layout from './layout/index.vue';
import Scroll from './scroll/index.vue';
import TimeLine from './time-line/index.vue';
import DateGridBg from './date-grid/bg.vue';
import DateGrid from './date-grid/index.vue';
import Group from './group/index.vue';
import WorkTimeGrid from './work-time-grid/index.vue';
import CurrentTime from './current-time/index.vue';
import BarGrid from './bar-grid/index.vue';
import DragBarGrid from './drag-bar-grid/index.vue';
import AttachedBarGrid from './attached-bar-grid/index.vue';
import SelectBarGrid from './select-bar-grid/index.vue';
import ContextmenuBarGrid from './contextmenu-bar-grid/index.vue';
import LinkGrid from './link-grid/index.vue';
import MouseHoverAutoScroll from './mouse-hover-auto-scroll/index.vue';
import BarTipGrid from './bar-tip-grid/index.vue';
import { LinkShowStrategy } from '@/types/gantt-link';
import { Unit } from '@/types/unit';
import { BarId, GanttBarAddParams, GanttBarUpdateParams } from '@/types/gantt-bar';
import { isUndefined } from 'lodash';
import { GanttBusEvents } from '@/types/gantt-bus';
import { GanttGroup } from '../models/gantt-group';

const { entityReady, container, scroll, ganttEntity, bus } = useStore()!;
const { scrollReady } = scroll;

const setDraggable = (val: boolean) => {
  ganttEntity.config.draggable = val;
};

const setSelectable = (val:boolean) => {
  ganttEntity.config.selectable = val;
};

const setDataScaleUnit = (unit: (keyof typeof Unit)) => {
  ganttEntity.config.dataScaleUnit = Unit[unit];
};

const setSizeRatioPercent = (sizeRatioPercent:number) => {
  ganttEntity.layoutConfig.sizeRatioPercent = sizeRatioPercent;
};

const removeBarById = (id:BarId) => {
  if (ganttEntity.bars.isExist(id)) {
    const bar = ganttEntity.bars.getById(id)!;
    const group = bar?.group;
    ganttEntity.bars.removeById(id);
    // ganttEntity.bars.calculateGroupOverlap({ groupId: group.id });
  }
};

const addBar = (bar:GanttBarAddParams) => {
  ganttEntity.addBar(bar);
  const b = ganttEntity.bars.getById(bar.id)!;
  b.calculate();
  ganttEntity.bars.calculateGroupOverlap({ groupId: b.group.id });
};

const updateBar = (id:BarId, data:GanttBarUpdateParams) => {
  const bar = ganttEntity.bars.getById(id);
  if (bar) {
    bar.update(data);
  }
};

defineExpose({
  api: () => ({
    setDraggable,
    setSelectable,
    setDataScaleUnit,
    setSizeRatioPercent,
    removeBarById,
    addBar,
    updateBar,
    history: {
      next: () => ganttEntity.history.next(),
      back: () => ganttEntity.history.back()
    }
  }) 
});
</script>

<style scoped>

</style>