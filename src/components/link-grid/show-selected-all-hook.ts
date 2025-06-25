import { onBeforeUnmount, onMounted, Ref, ref, ShallowRef, shallowRef } from 'vue';
import { useStore } from '../store';
import { GanttLinkView } from '@/models/gantt-link-view';
import { isRectanglesOverlap } from '@/utils/is-rectangles-overlap';
import { max, min, uniq } from 'lodash';
import { Id } from '@/types/id';
import { Events } from '@/types';

export const useShowSelectedAllHook = () => {
  const lazyLinkGrid: ShallowRef<ReturnType<typeof GanttLinkView.prototype.toJSON>[]> = shallowRef([]);
  const draggingBarIds = ref<Id[]>([]);
  const { ganttEntity, lazy, bus } = useStore()!;
  const { visibleAreaStartX, visibleAreaEndX, visibleAreaStartY, visibleAreaEndY, lazyReady } = lazy;
  const lazyCalculate = () => {
    const selectBarIds = ganttEntity.bars.filter(item => item.selected).map(bar => bar.id);
    const linkGroups = ganttEntity.links
      .filter(link => selectBarIds.includes(link.source.id) || selectBarIds.includes(link.target.id))
      .map(item => item.linkGroup);

    lazyLinkGrid.value = ganttEntity.links
      .filter(link => linkGroups.includes(link.linkGroup))
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

  const onBarPosChange = (ids:Id[]) => {
    const links = uniq(ids.reduce<GanttLinkView[]>((acc, id) => {
      const links = ganttEntity.links.getLinksByBarId(id);
      return [...acc, ...links];
    }, []));
    links.forEach(link => link.calculate());
    lazyCalculate();
  };

  
  onMounted(() => {
    bus.on(Events.VISIBLE_AREA_CHANGE, onVisibleAreaChange);
    bus.on(Events.BAR_DRAGGING_CHANGE, onBarDraggingChange);
    bus.on(Events.BAR_SELECT_CHANGE, onVisibleAreaChange);
    bus.on(Events.BAR_POS_CHANGE, onBarPosChange);
  });
    
  onBeforeUnmount(() => {
    bus.off(Events.VISIBLE_AREA_CHANGE, onVisibleAreaChange);
    bus.off(Events.BAR_DRAGGING_CHANGE, onBarDraggingChange);
    bus.off(Events.BAR_SELECT_CHANGE, onVisibleAreaChange);
    bus.off(Events.BAR_POS_CHANGE, onBarPosChange);
  });

  return {
    lazyLinkGrid,
    draggingBarIds 
  };
};