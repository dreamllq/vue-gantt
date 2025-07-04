import { GanttBarView } from '@/models/gantt-bar-view';
import { onBeforeUnmount, onMounted, ref, shallowRef } from 'vue';
import { useStore } from '../store';
import { isRectanglesOverlap } from '@/utils/is-rectangles-overlap';
import { Events } from '@/types/events';
import { GanttAttachedBarView } from '@/models/gantt-attached-bar-view';
import { AttachedBarId } from '@/types/gantt-attached-bar';
import { GroupId } from '@/types/gantt-group';

export const useAttachedBarHook = () => {
  const lazyAttachedBarGrid = shallowRef<ReturnType<typeof GanttAttachedBarView.prototype.toJSON>[]>([]);

  const { ganttEntity, lazy, bus } = useStore()!;
  const { visibleAreaStartX, visibleAreaEndX, visibleAreaStartY, visibleAreaEndY, lazyReady } = lazy;

  const lazyCalculate = () => {
    lazyAttachedBarGrid.value = ganttEntity.attachedBars.filter(bar => bar.isShow).filter(item => isRectanglesOverlap({
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

  const onAttachedBarChange = (ids:AttachedBarId[]) => {
    lazyAttachedBarGrid.value = lazyAttachedBarGrid.value.map(item => {
      if (ids.includes(item.id)) {
        return ganttEntity.attachedBars.getById(item.id)!.toJSON();
      } else {
        return item;
      }
    });
  };
  const onGroupExpandChange = (ids: GroupId[]) => {
    ids.forEach(id => {
      ganttEntity.attachedBars.updateGroupExpandChangeEffectBar(id);
    });
    ganttEntity.attachedBars.updateShow();
    bus.emit(Events.ATTACHED_BAR_VISIBLE_CHANGE);
  };

  onMounted(() => {
    bus.on(Events.VISIBLE_AREA_CHANGE, onVisibleAreaChange);
    bus.on(Events.ATTACHED_BAR_VISIBLE_CHANGE, onVisibleAreaChange);
    bus.on(Events.ATTACHED_BAR_CHANGE, onAttachedBarChange);
    bus.on(Events.GROUP_EXPAND_CHANGE, onGroupExpandChange);
  });
  
  onBeforeUnmount(() => {
    bus.off(Events.VISIBLE_AREA_CHANGE, onVisibleAreaChange);
    bus.on(Events.ATTACHED_BAR_VISIBLE_CHANGE, onVisibleAreaChange);
    bus.off(Events.ATTACHED_BAR_CHANGE, onVisibleAreaChange);
    bus.off(Events.GROUP_EXPAND_CHANGE, onGroupExpandChange);
  });

  return { lazyAttachedBarGrid };
};