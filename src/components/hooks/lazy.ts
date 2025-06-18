import { Gantt } from '@/models/gantt';
import { useScroll } from './scroll';
import { useLayout } from './layout';
import { computed, ref, watch } from 'vue';
import { debounce, max, min } from 'lodash';
import { useBus } from './bus';

export const useLazy = (ganttEntity: Gantt, store:{
  scroll: ReturnType<typeof useScroll>;
  layout: ReturnType<typeof useLayout>;
  bus: ReturnType<typeof useBus>;
}) => {
  const { scrollLeft, scrollTop } = store.scroll;
  const { mainWidth, mainHeight } = store.layout;

  const visibleAreaStartX = ref();
  const visibleAreaEndX = ref();
  const visibleAreaStartY = ref();
  const visibleAreaEndY = ref();
  const visibleAreaStartDate = ref();
  const visibleAreaEndDate = ref();
  const visibleAreaStartGroupIndex = ref();
  const visibleAreaEndGroupIndex = ref();

  const calculateVisibleArea = () => {
    console.log(scrollLeft.value, mainWidth.value);
    
    visibleAreaStartX.value = max([0, scrollLeft.value - mainWidth.value]) || 0;
    visibleAreaEndX.value = min([scrollLeft.value + (mainWidth.value * 2), ganttEntity.config.totalSeconds * ganttEntity.config.secondWidth]) || 0;
    visibleAreaStartY.value = max([0, scrollTop.value - mainHeight.value]) || 0;
    visibleAreaEndY.value = max([scrollTop.value + (mainHeight.value * 2), ganttEntity.groups.expandedGroups.length * ganttEntity.layoutConfig.ROW_HEIGHT]) || 0;

    visibleAreaStartDate.value = ganttEntity.config.startDate.clone().add(Math.floor(visibleAreaStartX.value / ganttEntity.config.secondWidth), 'second');
    visibleAreaEndDate.value = ganttEntity.config.startDate.clone().add(Math.floor(visibleAreaEndX.value / ganttEntity.config.secondWidth), 'second');
    visibleAreaStartGroupIndex.value = Math.floor(visibleAreaStartY.value / ganttEntity.layoutConfig.ROW_HEIGHT);
    visibleAreaEndGroupIndex.value = Math.ceil(visibleAreaEndY.value / ganttEntity.layoutConfig.ROW_HEIGHT);

    store.bus.emit('visible-area-change');
  };
  const calculateVisibleAreaDebounce = debounce(calculateVisibleArea, 50);

  watch(() => [
    scrollLeft.value,
    scrollTop.value,
    mainWidth.value,
    mainHeight.value
  ], () => {
    calculateVisibleAreaDebounce();
  }, {
    immediate: true,
    deep: true
  });

  return {
    visibleAreaStartX,
    visibleAreaEndX,
    visibleAreaStartY,
    visibleAreaEndY,
    visibleAreaStartDate,
    visibleAreaEndDate,
    visibleAreaStartGroupIndex,
    visibleAreaEndGroupIndex
  };
};