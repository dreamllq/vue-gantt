import { onBeforeUnmount, onMounted, Ref, ref } from 'vue';
import { useStore } from '../store';
import { GanttLinkView } from '@/models/gantt-link-view';
import { isRectanglesOverlap } from '@/utils/is-rectangles-overlap';
import { max, min, uniq } from 'lodash';
import { Id } from '@/types/id';

export const useShowAllHook = () => {
  const lazyLinkGrid: Ref<GanttLinkView[]> = ref([]);
  const draggingBarIds = ref<Id[]>([]);
  const { ganttEntity, lazy, bus } = useStore()!;
  const { visibleAreaStartX, visibleAreaEndX, visibleAreaStartY, visibleAreaEndY, lazyReady } = lazy;
  const lazyCalculate = () => {
    lazyLinkGrid.value = ganttEntity.links.filter(link => isRectanglesOverlap({
      x1: visibleAreaStartX.value,
      y1: visibleAreaStartY.value,
      x2: visibleAreaEndX.value,
      y2: visibleAreaEndY.value
    }, {
      x1: min(link.path.map(point => point.x)) || 0,
      y1: min(link.path.map(point => point.y)) || 0,
      x2: max(link.path.map(point => point.x)) || 0,
      y2: max(link.path.map(point => point.y)) || 0
    }));
  };

  if (lazyReady.value) {
    lazyCalculate();
  }

  const onBarDraggingChange = (ids:Id[], dragging: boolean) => {
    if (dragging) {
      draggingBarIds.value = ids;
    } else {
      // 找到关联的link，并重新计算
      const links = uniq(ids.reduce<GanttLinkView[]>((acc, id) => {
        const links = ganttEntity.links.getLinksByBarId(id);
        return [...acc, ...links];
      }, []));
      links.forEach(link => link.calculate());
      lazyCalculate();
      draggingBarIds.value = [];
    }
  };
    
  const onVisibleAreaChange = () => {
    lazyCalculate();
  };
  
  onMounted(() => {
    bus.on('visible-area-change', onVisibleAreaChange);
    bus.on('bar-dragging-change', onBarDraggingChange);
  });
    
  onBeforeUnmount(() => {
    bus.off('visible-area-change', onVisibleAreaChange);
    bus.off('bar-dragging-change', onBarDraggingChange);
  });

  return {
    lazyLinkGrid,
    draggingBarIds 
  };
};