import { onBeforeUnmount, onMounted, Ref, ref, ShallowRef, shallowRef } from 'vue';
import { useStore } from '../store';
import { GanttLinkView } from '@/models/gantt-link-view';
import { isRectanglesOverlap } from '@/utils/is-rectangles-overlap';
import { max, min, uniq, uniqBy, uniqWith } from 'lodash';
import { Events } from '@/types/events';
import { BarId } from '@/types/gantt-bar';
import { GanttBarView } from '@/models/gantt-bar-view';

export const useShowSelectedAllHook = () => {
  const lazyLinkGrid: ShallowRef<ReturnType<typeof GanttLinkView.prototype.toJSON>[]> = shallowRef([]);
  const selectedBarsLinks: ShallowRef<GanttLinkView[]> = shallowRef([]);
  const draggingBarIds = ref<BarId[]>([]);
  const { ganttEntity, lazy, bus, zIndex } = useStore()!;
  const { visibleAreaStartX, visibleAreaEndX, visibleAreaStartY, visibleAreaEndY, lazyReady } = lazy;
  const { upZIndex } = zIndex;
  const lazyCalculate = () => {
    lazyLinkGrid.value = selectedBarsLinks.value
      .filter(link => link.isShow)
      .filter(link => isRectanglesOverlap({
        x1: visibleAreaStartX.value,
        y1: visibleAreaStartY.value,
        x2: visibleAreaEndX.value,
        y2: visibleAreaEndY.value
      }, {
        x1: link.sx,
        y1: link.sy,
        x2: link.ex,
        y2: link.ey
      })).map(link => link.toJSON());
  };

  const calculateSelectedBarsLinks = () => {
    selectedBarsLinks.value = uniqBy(ganttEntity.bars.selectedBars
      .reduce<GanttLinkView[]>((acc, bar) => {
        const links = ganttEntity.links.getLinksByBarId(bar.id);
        return [...acc, ...links];
      }, [])
      .map(item => item.linkGroup)
      .reduce<GanttLinkView[]>((acc, item) => {
        const links = ganttEntity.links.linkGroupMap[item!];
        return [...acc, ...links];
      }, []), item => item.id);
  };
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

  const calculateSelectedZIndex = () => {
    const zIndex = upZIndex(); 
    selectedBarsLinks.value.forEach(link => {
      link.zIndex = zIndex;
    });
    const allBar = uniqBy(selectedBarsLinks.value.reduce<GanttBarView[]>((acc, link) => [
      ...acc,
        ganttEntity.bars.getById(link.source.id)!,
        ganttEntity.bars.getById(link.target.id)!
    ], []), bar => bar.id);
    allBar.forEach(bar => {
      bar.zIndex = zIndex;
    });
  
    // bus.emit(Events.BAR_CHANGE, allBar.map(bar => bar.id));
  };
  
  const onLinksChange = () => {
    calculateSelectedBarsLinks();
    lazyCalculate();
  };

  const onBarChange = (barIds:BarId[]) => {
    ganttEntity.links.updateShow();
    calculateSelectedBarsLinks();
    selectedBarsLinks.value.forEach(link => {
      if (barIds.includes(link.source.id) || barIds.includes(link.target.id)) {
        link.calculate();
      }
    });
    // calculateSelectedZIndex();
    lazyCalculate();
  };

  const onBarSelectedChange = (barIds:BarId[]) => {
    calculateSelectedBarsLinks();
    selectedBarsLinks.value.forEach(link => {
      if (barIds.includes(link.source.id) || barIds.includes(link.target.id)) {
        link.calculate();
      }
    });
    calculateSelectedZIndex();
    lazyCalculate();
  };
  
  onMounted(() => {
    bus.on(Events.VISIBLE_AREA_CHANGE, onVisibleAreaChange);
    bus.on(Events.BAR_DRAGGING_CHANGE, onBarDraggingChange);
    bus.on(Events.LINKS_CHANGE, onLinksChange);
    bus.on(Events.BAR_CHANGE_FRAGMENTATION, onBarChange);
    bus.on(Events.BAR_SELECTED_CHANGE, onBarSelectedChange);
  });
    
  onBeforeUnmount(() => {
    bus.off(Events.VISIBLE_AREA_CHANGE, onVisibleAreaChange);
    bus.off(Events.BAR_DRAGGING_CHANGE, onBarDraggingChange);
    bus.off(Events.LINKS_CHANGE, onLinksChange);
    bus.off(Events.BAR_CHANGE_FRAGMENTATION, onBarChange);
    bus.off(Events.BAR_SELECTED_CHANGE, onBarSelectedChange);
  });

  return {
    lazyLinkGrid,
    draggingBarIds 
  };
};