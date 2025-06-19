import { computeDayList } from '@/utils/computeDayList';
import { useStore } from '../store';
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { isRectanglesOverlap } from '@/utils/is-rectangles-overlap';
import { cloneDeep } from 'lodash';

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
export const useDateGridHook = () => {
  const grid = ref<GridItem[]>([]);
  const lazyGrid = ref<GridItem[]>([]);

  const { ganttEntity, lazy, bus } = useStore()!;

  const { visibleAreaStartX, visibleAreaEndX, visibleAreaStartY, visibleAreaEndY, lazyReady } = lazy;

  const calculate = () => {
    const dl = computeDayList(ganttEntity.config.startDate, ganttEntity.config.dataUnitCount, ganttEntity.config.dataScaleUnit);
    ganttEntity.groups.expandedGroups.forEach((item, index) => {
      dl.forEach(dItem => {
        grid.value.push({
          index,
          seconds: dItem.seconds,
          date: dItem.date,
          x: dItem.date.diff(ganttEntity.config.startDate, 'second') * ganttEntity.config.secondWidth,
          y: index * ganttEntity.layoutConfig.ROW_HEIGHT,
          width: dItem.seconds * ganttEntity.config.secondWidth,
          height: ganttEntity.layoutConfig.ROW_HEIGHT,
          timeString: dItem.date.format('YYYY-MM-DD HH:mm:ss')
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
  
  onMounted(() => {
    bus.on('visible-area-change', onVisibleAreaChange);
  });
  
  onBeforeUnmount(() => {
    bus.off('visible-area-change', onVisibleAreaChange);
  });

  return {
    lazyGrid,
    grid
  };
};