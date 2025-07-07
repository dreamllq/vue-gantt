import { onBeforeUnmount, onMounted, Ref, ref } from 'vue';
import { useStore } from '../store';
import moment from 'moment';
import { cloneDeep } from 'lodash';
import { isRectanglesOverlap } from '@/utils/is-rectangles-overlap';
import { Events } from '@/types/events';
import { GroupId } from '@/types/gantt-group';
import { WorkTimeId } from '@/types/gantt-work-time';
import { BizArray } from '@/models/biz-array';
import { GanttWorkTimeView } from '@/models/gantt-work-time-view';

export const useWorkTimeGridHook = () => {
  const lazyWorkTimeGrid: Ref<GanttWorkTimeView[]> = ref([]);

  const { ganttEntity, lazy, bus } = useStore()!;
  const { visibleAreaStartX, visibleAreaEndX, visibleAreaStartY, visibleAreaEndY, lazyReady } = lazy;

  const lazyCalculate = () => {
    lazyWorkTimeGrid.value = ganttEntity.workTimes.filter(item => isRectanglesOverlap({
      x1: visibleAreaStartX.value,
      y1: visibleAreaStartY.value,
      x2: visibleAreaEndX.value,
      y2: visibleAreaEndY.value
    }, {
      x1: item.sx,
      y1: item.sy,
      x2: item.sx + item.width,
      y2: item.sy + item.height
    }));
  };

  const updateData = (workTimeIds: WorkTimeId[]) => {
    workTimeIds.forEach(workTimeId => {
      const item = ganttEntity.workTimes.getById(workTimeId)!;
      item.updateY();
    });
  };

  if (lazyReady.value) {
    lazyCalculate();
  }

  const onVisibleAreaChange = () => {
    lazyCalculate();
  };
  

  const onWorkTimeChange = (workTimeIds: WorkTimeId[]) => {
    // console.log(workTimeIds);
    
    console.time('onWorkTimeChange updateData');
    updateData(workTimeIds);
    console.timeEnd('onWorkTimeChange updateData');
    lazyCalculate();
  };

  onMounted(() => {
    bus.on(Events.VISIBLE_AREA_CHANGE, onVisibleAreaChange);
    bus.on(Events.WORK_TIME_CHANGE, onWorkTimeChange);
  });
  
  onBeforeUnmount(() => {
    bus.off(Events.VISIBLE_AREA_CHANGE, onVisibleAreaChange);
    bus.off(Events.WORK_TIME_CHANGE, onWorkTimeChange);
  });

  return { lazyWorkTimeGrid };
};