<template>
  <container v-if='entityReady'>
    <layout v-if='scrollReady'>
      <template #aside-header>
        <slot name='aside-header'>
          GANTT
        </slot>
      </template>
      <template #aside-main>
        <group />
      </template>
      <template #main-header>
        <time-line />
      </template>
      <template #main-main>
        <date-grid-bg />
        <work-time-grid />
        <date-grid />
        <bar-grid>
          <template #default='slotProps'>
            <slot name='bar' v-bind='slotProps' />
          </template>
        </bar-grid>
        <drag-bar-grid v-if='ganttEntity.config.draggable && !ganttEntity.config.multipleDraggable'>
          <template #draggingBar='slotProps'>
            <slot name='bar' v-bind='slotProps' />
          </template>
        </drag-bar-grid>
        <select-bar-grid v-if='ganttEntity.config.selectable && !ganttEntity.config.checkable' />
        <link-grid v-if='ganttEntity.config.linkShowStrategy !== LinkShowStrategy.NONE' />
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
import BarGrid from './bar-grid/index.vue';
import DragBarGrid from './drag-bar-grid/index.vue';
import SelectBarGrid from './select-bar-grid/index.vue';
import LinkGrid from './link-grid/index.vue';
import { LinkShowStrategy } from '@/types/gantt-link';

const { entityReady, container, scroll, ganttEntity } = useStore()!;
const { scrollReady } = scroll;
</script>

<style scoped>

</style>