import { Gantt } from '@/models/gantt';
import { useScroll } from './scroll';
import { useLayout } from './layout';
import { computed, ref, watch } from 'vue';
import { debounce, max, min } from 'lodash';
import { useBus } from './bus';
import { Events } from '@/types/events';
import { dateAdd } from '@/utils/date-add';
import { strToDate } from '@/utils/to-date';
import { Unit } from '@/types/unit';

export const useLazy = (ganttEntity: Gantt, store:{
  scroll: ReturnType<typeof useScroll>;
  layout: ReturnType<typeof useLayout>;
  bus: ReturnType<typeof useBus>;
}) => {
  const { scrollLeft, scrollTop } = store.scroll;
  const { mainWidth, mainHeight, layoutReady } = store.layout;
  const lazyReady = ref(false);

  const visibleAreaStartX = ref();
  const visibleAreaEndX = ref();
  const visibleAreaStartY = ref();
  const visibleAreaEndY = ref();
  const visibleAreaStartDate = ref();
  const visibleAreaEndDate = ref();
  const visibleAreaStartGroupIndex = ref();
  const visibleAreaEndGroupIndex = ref();

  const calculateVisibleArea = () => {
    if (layoutReady.value === false) return;
    visibleAreaStartX.value = max([0, scrollLeft.value - mainWidth.value]) || 0;
    visibleAreaEndX.value = min([scrollLeft.value + (mainWidth.value * 2), ganttEntity.config.totalSeconds * ganttEntity.config.secondWidth]) || 0;
    visibleAreaStartY.value = max([0, scrollTop.value - mainHeight.value]) || 0;
    visibleAreaEndY.value = min([scrollTop.value + (mainHeight.value * 2), ganttEntity.groups.getGroupHeight()]) || 0;

    
    visibleAreaStartDate.value = dateAdd(strToDate(ganttEntity.config.start), Math.floor(visibleAreaStartX.value / ganttEntity.config.secondWidth), Unit.SECOND);
    visibleAreaEndDate.value = dateAdd(strToDate(ganttEntity.config.start), Math.floor(visibleAreaEndX.value / ganttEntity.config.secondWidth), Unit.SECOND);
    visibleAreaStartGroupIndex.value = ganttEntity.groups.getGroupIndexByTop(visibleAreaStartY.value);
    visibleAreaEndGroupIndex.value = ganttEntity.groups.getGroupIndexByTop(visibleAreaEndY.value) + 1;
    lazyReady.value = true;
    store.bus.emit(Events.VISIBLE_AREA_CHANGE);
  };
  const calculateVisibleAreaDebounce = debounce(calculateVisibleArea, max([ganttEntity.config.lazyDebounceTime, 30])!);

  watch(() => [
    scrollLeft.value,
    scrollTop.value,
    mainWidth.value,
    mainHeight.value
  ], () => {
    calculateVisibleAreaDebounce();
  }, { deep: true });

  return {
    lazyReady,
    visibleAreaStartX,
    visibleAreaEndX,
    visibleAreaStartY,
    visibleAreaEndY,
    visibleAreaStartDate,
    visibleAreaEndDate,
    visibleAreaStartGroupIndex,
    visibleAreaEndGroupIndex,
    calculateVisibleArea
  };
};