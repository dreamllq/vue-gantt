import { GanttBarView } from '@/models/gantt-bar-view';
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useStore } from '../store';
import { isRectanglesOverlap } from '@/utils/is-rectangles-overlap';

export const useBarGridHook = () => {
  const lazyBarGrid = ref<GanttBarView[]>([]);

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
    }));
  };

  if (lazyReady.value) {
    lazyCalculate();
  }
  
  const onVisibleAreaChange = () => {
    lazyCalculate();
  };

  const onBarChange = () => {
    lazyCalculate();
  };
  
  onMounted(() => {
    bus.on('visible-area-change', onVisibleAreaChange);
    bus.on('bar-change', onBarChange);
  });
  
  onBeforeUnmount(() => {
    bus.off('visible-area-change', onVisibleAreaChange);
    bus.off('bar-change', onBarChange);
  });

  return { lazyBarGrid };
};