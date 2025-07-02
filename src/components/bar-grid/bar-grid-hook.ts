import { GanttBarView } from '@/models/gantt-bar-view';
import { onBeforeUnmount, onMounted, ref, shallowRef } from 'vue';
import { useStore } from '../store';
import { isRectanglesOverlap } from '@/utils/is-rectangles-overlap';
import { BarId } from '@/types/gantt-bar';
import { Events } from '@/types/events';
import { GroupId } from '@/types/gantt-group';
export const useBarGridHook = () => {
  const lazyBarGrid = shallowRef<ReturnType<typeof GanttBarView.prototype.toJSON>[]>([]);

  const { ganttEntity, lazy, bus } = useStore()!;
  const { visibleAreaStartX, visibleAreaEndX, visibleAreaStartY, visibleAreaEndY, lazyReady } = lazy;

  const lazyCalculate = () => {
    lazyBarGrid.value = ganttEntity.bars.filter(bar => bar.isShow).filter(item => isRectanglesOverlap({
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
  console.log(lazyReady);

  if (lazyReady.value) {
    lazyCalculate();
  }
  
  const onVisibleAreaChange = () => {
    lazyCalculate();
  };

  const onBarChange = (ids:BarId[]) => {
    lazyBarGrid.value = lazyBarGrid.value.map(item => {
      if (ids.includes(item.id)) {
        return ganttEntity.bars.getById(item.id)!.toJSON();
      } else {
        return item;
      }
    });
  };
  const onGroupExpandChange = (ids: GroupId[]) => {
    ids.forEach(id => {
      ganttEntity.bars.updateGroupExpandChangeEffectBar(id);
    });
    ganttEntity.bars.updateShow();
    bus.emit(Events.BAR_VISIBLE_CHANGE);
  };

  onMounted(() => {
    bus.on(Events.VISIBLE_AREA_CHANGE, onVisibleAreaChange);
    bus.on(Events.BAR_VISIBLE_CHANGE, onVisibleAreaChange);
    bus.on(Events.BAR_CHANGE_FRAGMENTATION, onBarChange);
    bus.on(Events.GROUP_EXPAND_CHANGE, onGroupExpandChange);
    bus.on(Events.BARS_CHANGE, onVisibleAreaChange);
  });
  
  onBeforeUnmount(() => {
    bus.off(Events.VISIBLE_AREA_CHANGE, onVisibleAreaChange);
    bus.off(Events.BAR_VISIBLE_CHANGE, onVisibleAreaChange);
    bus.off(Events.BAR_CHANGE_FRAGMENTATION, onBarChange);
    bus.off(Events.GROUP_EXPAND_CHANGE, onGroupExpandChange);
    bus.off(Events.BARS_CHANGE, onVisibleAreaChange);
  });

  return { lazyBarGrid };
};