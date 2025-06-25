import { GanttBarView } from '@/models/gantt-bar-view';
import { onBeforeUnmount, onMounted, ref, shallowRef } from 'vue';
import { useStore } from '../store';
import { isRectanglesOverlap } from '@/utils/is-rectangles-overlap';
import { Events, Id } from '@/types';
export const useBarGridHook = () => {
  const lazyBarGrid = shallowRef<ReturnType<typeof GanttBarView.prototype.toJSON>[]>([]);

  const { ganttEntity, lazy, bus } = useStore()!;
  const { visibleAreaStartX, visibleAreaEndX, visibleAreaStartY, visibleAreaEndY, lazyReady } = lazy;

  const lazyCalculate = () => {
    lazyBarGrid.value = ganttEntity.bars.filter(item => isRectanglesOverlap({
      x1: visibleAreaStartX.value,
      y1: visibleAreaStartY.value,
      x2: visibleAreaEndX.value,
      y2: visibleAreaEndY.value
    }, {
      x1: item.sx,
      y1: item.sy,
      x2: item.ex,
      y2: item.ey 
    })).map(item => item.toJSON());
  };

  if (lazyReady.value) {
    lazyCalculate();
  }
  
  const onVisibleAreaChange = () => {
    lazyCalculate();
  };

  const onBarChange = (ids:Id[]) => {
    lazyBarGrid.value = lazyBarGrid.value.map(item => {
      if (ids.includes(item.id)) {
        return ganttEntity.bars.getById(item.id)!.toJSON();
      } else {
        return item;
      }
    });
  };
  
  onMounted(() => {
    bus.on(Events.VISIBLE_AREA_CHANGE, onVisibleAreaChange);
    bus.on(Events.BAR_CHANGE_FRAGMENTATION, onBarChange);
  });
  
  onBeforeUnmount(() => {
    bus.off(Events.VISIBLE_AREA_CHANGE, onVisibleAreaChange);
    bus.off(Events.BAR_CHANGE_FRAGMENTATION, onBarChange);
  });

  return { lazyBarGrid };
};