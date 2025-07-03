import { onBeforeUnmount, onMounted, Ref, ref } from 'vue';
import { useStore } from '../store';
import { GanttLinkView } from '@/models/gantt-link-view';
import { isRectanglesOverlap } from '@/utils/is-rectangles-overlap';
import { max, min, uniq } from 'lodash';
import { Events } from '@/types/events';
import { BarId } from '@/types/gantt-bar';

export const useShowSelectedHook = () => {
  const lazyLinkGrid: Ref<ReturnType<typeof GanttLinkView.prototype.toJSON>[]> = ref([]);
  const draggingBarIds = ref<BarId[]>([]);
  const { ganttEntity, lazy, bus } = useStore()!;
  const { visibleAreaStartX, visibleAreaEndX, visibleAreaStartY, visibleAreaEndY, lazyReady } = lazy;
  const lazyCalculate = () => {
    lazyLinkGrid.value = ganttEntity.bars.selectedBars
      .reduce<GanttLinkView[]>((acc, bar) => {
        const links = ganttEntity.links.getLinksByBarId(bar.id);
        return [...acc, ...links];
      }, [])
      .filter(link => {
        link.calculate();
        return link;
      })
      .filter(link => isRectanglesOverlap({
        x1: visibleAreaStartX.value,
        y1: visibleAreaStartY.value,
        x2: visibleAreaEndX.value,
        y2: visibleAreaEndY.value
      }, {
        x1: min(link.path.map(point => point.x)) || 0,
        y1: min(link.path.map(point => point.y)) || 0,
        x2: max(link.path.map(point => point.x)) || 0,
        y2: max(link.path.map(point => point.y)) || 0
      })).map(link => link.toJSON());
  };

  if (lazyReady.value) {
    lazyCalculate();
  }

  const onBarDraggingChange = (ids:BarId[], dragging: boolean) => {
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

  const onBarPosChange = (ids:BarId[]) => {
    const links = uniq(ids.reduce<GanttLinkView[]>((acc, id) => {
      const links = ganttEntity.links.getLinksByBarId(id);
      return [...acc, ...links];
    }, []));
    links.forEach(link => link.calculate());
    lazyCalculate();
  };

  const onBarVisibleChange = () => {
    ganttEntity.links.updateShow();
    ganttEntity.links.calculate();
    lazyCalculate();
  };
  
  onMounted(() => {
    bus.on(Events.VISIBLE_AREA_CHANGE, onVisibleAreaChange);
    bus.on(Events.BAR_DRAGGING_CHANGE, onBarDraggingChange);
    bus.on(Events.BAR_SELECT_CHANGE, onVisibleAreaChange);
    bus.on(Events.BAR_POS_CHANGE_FRAGMENTATION, onVisibleAreaChange);
    bus.on(Events.BAR_VISIBLE_CHANGE, onBarVisibleChange);
    bus.on(Events.LINKS_CHANGE, onVisibleAreaChange);
  });
    
  onBeforeUnmount(() => {
    bus.off(Events.VISIBLE_AREA_CHANGE, onVisibleAreaChange);
    bus.off(Events.BAR_DRAGGING_CHANGE, onBarDraggingChange);
    bus.off(Events.BAR_SELECT_CHANGE, onVisibleAreaChange);
    bus.off(Events.BAR_POS_CHANGE_FRAGMENTATION, onVisibleAreaChange);
    bus.off(Events.BAR_VISIBLE_CHANGE, onBarVisibleChange);
    bus.off(Events.LINKS_CHANGE, onVisibleAreaChange);
  });

  return {
    lazyLinkGrid,
    draggingBarIds 
  };
};