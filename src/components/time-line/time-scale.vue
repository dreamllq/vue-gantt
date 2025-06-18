<template>
  <div ref='timeScale' class='time-scale'>
    <template v-for='item in scaleList' :key='item.scale'>
      <div
        class='time-text'
        :style='{
          transform: `translateX(${item.left}px) translateY(0px)`
        }'>
        <slot name='date-unit-scale-text' :data='item'>
          {{ item.scale }}
        </slot>
      </div>
      <div
        class='time-scale-item'
        :style='{
          transform: `translateX(${item.left}px) translateY(0px)`
        }' />
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { SECOND_MAP } from '@/constants/time-transform';
import { STEP_LIST, MIN_SCALE_STEP_WIDTH } from '@/constants/scale-config';
import { cloneDeep } from 'lodash';
import { computeScaleList } from '@/utils/computeScaleList';
import { useStore } from '../store';

const props = defineProps({
  date: {
    type: Object,
    default: undefined
  }
});

const timeScale = ref();

const { ganttEntity } = useStore()!;

const thWidth = computed(() => ganttEntity.config.secondWidth * SECOND_MAP[ganttEntity.config.dataScaleUnit]);
const scaleList = computed(() => {
  const list = computeScaleList({
    dataScaleUnit: ganttEntity.config.dataScaleUnit,
    date: props.date,
    step: step.value,
    thWidth: thWidth.value,
    secondWidth: ganttEntity.config.secondWidth 
  });
  return list;
});


// 计算step
const step = computed(() => {
  const width = thWidth.value;
  // 判断 日 周 月
  let list:number[] = [];
  if (ganttEntity.config.dataScaleUnit === 'day') {
    list = cloneDeep(STEP_LIST.DAY);
    const stepNum = Math.floor(width / MIN_SCALE_STEP_WIDTH.DAY);
    return (24 / closestStep(list, Number(stepNum)));
  } else if (ganttEntity.config.dataScaleUnit === 'week') {
    list = cloneDeep(STEP_LIST.WEEK);
    const stepNum = Math.floor(width / MIN_SCALE_STEP_WIDTH.WEEK);
    return (7 / closestStep(list, Number(stepNum)));
  } else if (ganttEntity.config.dataScaleUnit === 'month') {
    list = cloneDeep(STEP_LIST.MONTH);
    const stepNum = Math.floor(width / MIN_SCALE_STEP_WIDTH.MONTH);
    return (30 / closestStep(list, Number(stepNum)));
  }
  return 0;
});

// 数组中寻找最接近的数
const closestStep = (list, num) => {
  let dValue = Math.abs(list[0] - num);
  let resultNum = list[0];
  list.forEach(item => {
    if (Math.abs(item - num) <= dValue) {
      dValue = Math.abs(item - num);
      resultNum = item;
    }
  });
  return resultNum; 
};

</script>

<style lang="scss" scoped>
.time-scale {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 10px;

  .time-text {
    font-size: 12px;
    bottom: 8px;
    padding-left: 2px;
    position: absolute;
    color: var(--el-text-color-regular);
    line-height: 1;
  }

  .time-scale-item {
    position: absolute;
    height: 20px;
    bottom: 0;
    left: 0;

    &::after{
      content: '';
      position: absolute;
      height: 100%;
      border-right: 1px solid var(--el-text-color-placeholder);
      left: 0;
      top: 0;
    }
  }
}
</style>