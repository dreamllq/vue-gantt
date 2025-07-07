import { GanttBarView } from '@/models/gantt-bar-view';
import { onBeforeUnmount, onMounted, ref, shallowRef } from 'vue';
import { useStore } from '../store';
import { isRectanglesOverlap } from '@/utils/is-rectangles-overlap';
import { BarId } from '@/types/gantt-bar';
import { Events } from '@/types/events';
export const useBarGridHook = () => {
  const lazyBarGrid = shallowRef<ReturnType<typeof GanttBarView.prototype.toJSON>[]>([]);

  const { ganttEntity, lazy, bus } = useStore()!;
  const { visibleAreaStartX, visibleAreaEndX, visibleAreaStartY, visibleAreaEndY, lazyReady } = lazy;

  const lazyCalculate = () => {
    lazyBarGrid.value = ganttEntity.bars
      .filter(bar => bar.isShow)
      .filter(item => isRectanglesOverlap({
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
    
    bus.emit(Events.BAR_LAZY_CHANGE, lazyBarGrid.value.map(item => item.id));
  };

  if (lazyReady.value) {
    lazyCalculate();
  }
  
  const onVisibleAreaChange = () => {
    lazyCalculate();
  };

  const onBarChange = (ids:BarId[]) => {
    lazyCalculate();
  };
 

  onMounted(() => {
    bus.on(Events.VISIBLE_AREA_CHANGE, onVisibleAreaChange);
    bus.on(Events.BAR_CHANGE_FRAGMENTATION, onBarChange);
    bus.on(Events.BARS_CHANGE, onVisibleAreaChange);
  });
  
  onBeforeUnmount(() => {
    bus.off(Events.VISIBLE_AREA_CHANGE, onVisibleAreaChange);
    bus.off(Events.BAR_CHANGE_FRAGMENTATION, onBarChange);
    bus.off(Events.BARS_CHANGE, onVisibleAreaChange);
  });

  return { lazyBarGrid };
};