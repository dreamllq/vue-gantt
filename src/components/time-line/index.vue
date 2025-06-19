<template>
  <div class='scale-list'>
    <template v-for='item in lazyDayList' :key='item.formatString'>
      <div
        :class='{
          "scale-cell": true,
        }'
        :style='{ 
          width: `${ganttEntity.config.secondWidth * item.seconds}px` ,
          left: `${ganttEntity.config.secondWidth * item.offsetSeconds}px`
        }'>
        <slot name='date-title-cell' :data='item'>
          <!-- <text-tip :msg='' /> -->
          {{ item.formatString }}
        </slot>
        <time-scale :date='item.date'>
          <template #date-unit-scale-text='scopedSlot'>
            <slot name='date-unit-scale-text' :data='{...scopedSlot.data, dataScaleUnit:ganttEntity.config.dataScaleUnit}' />
          </template>
        </time-scale>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useStore } from '../store';
import { useTimeLineHook } from './time-line-hook';
import TimeScale from './time-scale.vue';

const { ganttEntity } = useStore()!;
const { lazyDayList } = useTimeLineHook();
</script>

<style scoped lang="scss">
.scale-list{
  position: relative;
  height: 100%;
  width: 100%;
  overflow: hidden;
}
.scale-cell {
  display: inline-block;
  height: 100%;
  box-sizing: border-box;
  // border-right: 1px solid var(--border-color);
  text-align: center;
  font-size: 14px;
  user-select: none;
  position: relative;
  color: var(--el-text-color-secondary);
  padding-top: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  position: absolute;
  top: 0;

  &::after{
    content: '';
    position: absolute;
    height: 100%;
    border-right: 1px solid var(--border-color);
    right: 0;
    top: 0;
  }
}
</style>