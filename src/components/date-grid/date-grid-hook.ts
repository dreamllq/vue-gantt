import { computeDayList } from '@/utils/computeDayList';
import { useStore } from '../store';
import { onBeforeUnmount, onMounted, ref, shallowRef } from 'vue';
import { isRectanglesOverlap } from '@/utils/is-rectangles-overlap';
import { cloneDeep } from 'lodash';
import { Events } from '@/types/events';
import { strToDate } from '@/utils/to-date';
import { Unit } from '@/types/unit';
import { dateTimeFormat } from '@/utils/date-time-format';
import { dateDiff } from '@/utils/date-diff';

type GridItem = {
  index: number,
  seconds: number;
  x: number,
  y: number,
  width: number,
  height: number,
  timeString: string
}
export const useDateGridHook = () => {
  const grid = shallowRef<GridItem[]>([]);
  const lazyGrid = shallowRef<GridItem[]>([]);

  const { ganttEntity, lazy, bus } = useStore()!;

  const { visibleAreaStartX, visibleAreaEndX, visibleAreaStartY, visibleAreaEndY, lazyReady } = lazy;

  const calculate = () => {
    grid.value = [];
    const dl = computeDayList(strToDate(ganttEntity.config.start), ganttEntity.config.dataUnitCount, ganttEntity.config.dataScaleUnit);
     
    ganttEntity.groups.expandedGroups.forEach((item, index) => {
      dl.forEach(dItem => {
        grid.value.push({
          index,
          seconds: dItem.seconds,
          x: dateDiff(dItem.date, strToDate(ganttEntity.config.start), Unit.SECOND) * ganttEntity.config.secondWidth,
          y: ganttEntity.groups.getGroupTopByIndex(index),
          width: dItem.seconds * ganttEntity.config.secondWidth,
          height: item.height,
          timeString: dateTimeFormat(dItem.date)
        });
      });
    });
  };

  const lazyCalculate = () => {
    lazyGrid.value = cloneDeep(grid.value).filter(item => isRectanglesOverlap({
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

  const onDateGridChange = () => {
    calculate();
    lazyCalculate();
  };
  
  onMounted(() => {
    bus.on(Events.VISIBLE_AREA_CHANGE, onVisibleAreaChange);
    bus.on(Events.DATE_GRID_CHANGE, onDateGridChange);
  });
  
  onBeforeUnmount(() => {
    bus.off(Events.VISIBLE_AREA_CHANGE, onVisibleAreaChange);
    bus.off(Events.DATE_GRID_CHANGE, onDateGridChange);
  });

  return {
    lazyGrid,
    grid
  };
};