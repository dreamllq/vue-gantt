import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useStore } from '../store';
import moment from 'moment';
import { cloneDeep } from 'lodash';
import { isRectanglesOverlap } from '@/utils/is-rectangles-overlap';
import { Events } from '@/types/events';

type GridItem = {
  index: number,
  seconds: number;
  date: moment.Moment;
  x: number,
  y: number,
  width: number,
  height: number,
  timeString: string
}
export const useWorkTimeGridHook = () => {
  const workTimeGrid = ref<GridItem[]>([]);
  const lazyWorkTimeGrid = ref<GridItem[]>([]);


  const { ganttEntity, lazy, bus } = useStore()!;
  const { visibleAreaStartX, visibleAreaEndX, visibleAreaStartY, visibleAreaEndY, lazyReady } = lazy;

  const calculate = () => {
    workTimeGrid.value = [];
    ganttEntity.groups.expandedGroups.forEach((group, index) => {
      group.workTimes.forEach(wt => {
        const seconds = wt.endMoment.diff(wt.startMoment, 'second');
        workTimeGrid.value.push({
          index,
          seconds: seconds,
          date: wt.startMoment.clone(),
          x: wt.startMoment.diff(ganttEntity.config.startDate, 'second') * ganttEntity.config.secondWidth,
          y: ganttEntity.groups.getGroupTopByIndex(index),
          width: seconds * ganttEntity.config.secondWidth,
          height: group.height,
          timeString: wt.startMoment.format('YYYY-MM-DD HH:mm:ss')
        });
      });
    });
  };

  const lazyCalculate = () => {
    lazyWorkTimeGrid.value = cloneDeep(workTimeGrid.value).filter(item => isRectanglesOverlap({
      x1: visibleAreaStartX.value,
      y1: visibleAreaStartY.value,
      x2: visibleAreaEndX.value,
      y2: visibleAreaEndY.value
    }, {
      x1: item.x,
      y1: item.y,
      x2: item.x + item.width,
      y2: item.y + item.height
    }));
  };

  calculate();
  if (lazyReady.value) {
    lazyCalculate();
  }

  const onVisibleAreaChange = () => {
    lazyCalculate();
  };
  
  const onWorkTimeGridChange = () => {
    calculate();
    lazyCalculate();
  };

  onMounted(() => {
    bus.on(Events.VISIBLE_AREA_CHANGE, onVisibleAreaChange);
    bus.on(Events.WORK_TIME_GRID_CHANGE, onWorkTimeGridChange);
  });
  
  onBeforeUnmount(() => {
    bus.off(Events.VISIBLE_AREA_CHANGE, onVisibleAreaChange);
    bus.off(Events.WORK_TIME_GRID_CHANGE, onWorkTimeGridChange);
  });

  return {
    lazyWorkTimeGrid,
    workTimeGrid
  };
};