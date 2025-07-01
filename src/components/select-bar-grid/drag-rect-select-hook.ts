import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useStore } from '../store';
import { Events } from '@/types/events';
import dom from '@/utils/dom';
import { BarId } from '@/types/gantt-bar';
import { max, min } from 'lodash';

export const useDragRectSelectHook = () => {
  const { bus, container, scroll, ganttEntity, barHtmlClass } = useStore()!;
  const { scrollLeft, scrollTop } = scroll;
  
  const dragRect = ref<{
    sx:number,
    sy: number,
    ex: number,
    ey: number
  }>({
    sx: 0,
    sy: 0,
    ex: 0,
    ey: 0
  });
  const dragging = ref(false);
  const onDragStart = (e:MouseEvent) => {
    const domPath = dom.getPath(e.target as HTMLElement);
    const barTarget = domPath.find(p => p.classList && p.classList.contains(barHtmlClass)) as HTMLElement;
    if (barTarget) {
      const type = barTarget.dataset.type as string;
      const id = type === 'number' ? Number(barTarget.dataset.id) : barTarget.dataset.id as BarId;
      const bar = ganttEntity.bars.getById(id);
      if (bar) return;
    }
    
    const { x, y } = transformContainerPosition(e);
    dragRect.value.sx = x;
    dragRect.value.sy = y;
    dragRect.value.ex = x;
    dragRect.value.ey = y;
    dragging.value = true;
    bus.emit(Events.BAR_DRAGGING_CHANGE, [], true);
  };

  const onDrag = (e:MouseEvent) => {
    if (!dragging.value) return;
    
    const { x, y } = transformContainerPosition(e);
    dragRect.value.ex = x;
    dragRect.value.ey = y;
  };

  const onDragEnd = (e:MouseEvent) => {
    if (!dragging.value) return;
    const effectBarIds:BarId[] = [];
    ganttEntity.bars.filter(item => item.selected).forEach(item => {
      item.selected = false;
      effectBarIds.push(item.id);
    });

    const selectedBars = ganttEntity.bars.filter(bar => {
      if (!bar.selectable) return false;

      const sx = min([dragRect.value.sx, dragRect.value.ex])!;
      const ex = max([dragRect.value.sx, dragRect.value.ex])!;
      const sy = min([dragRect.value.sy, dragRect.value.ey])!;
      const ey = max([dragRect.value.sy, dragRect.value.ey])!;

      return bar.sx > sx && bar.sx < ex && bar.sy > sy && bar.sy < ey;
    });
    selectedBars.forEach(bar => {
      bar.selected = true;
      effectBarIds.push(bar.id);
    });

    dragging.value = false;
    bus.emit(Events.BAR_DRAGGING_CHANGE, [], false);
    bus.emit(Events.BAR_CHANGE, effectBarIds);
    bus.emit(Events.BAR_SELECT_CHANGE, effectBarIds);
  };

  const transformContainerPosition = (e:MouseEvent) => {
    const { x, y } = container.getBoundingClientRect()!;
    
    const scrollX = Math.max(scrollLeft.value, 0);
    const scrollY = Math.max(scrollTop.value, 0);
    const sx = Math.min(Math.max(e.x - x - ganttEntity.layoutConfig.GRID_CELL_WIDTH + scrollX, scrollX), scrollX + Math.min(ganttEntity.container.width, ganttEntity.config.totalSeconds * ganttEntity.config.secondWidth));
    const sy = Math.min(Math.max(e.y - y - ganttEntity.layoutConfig.HEADER_HEIGHT + scrollY, scrollY), scrollY + Math.min(ganttEntity.container.height, ganttEntity.groups.getGroupHeight()));
  
    return {
      x: sx,
      y: sy
    };
  };

  onMounted(() => {
    bus.on(Events.DRAGSTART, onDragStart);
    bus.on(Events.DRAG, onDrag);
    bus.on(Events.DRAGEND, onDragEnd);
  });
  
  onBeforeUnmount(() => {
    bus.off(Events.DRAGSTART, onDragStart);
    bus.off(Events.DRAG, onDrag);
    bus.off(Events.DRAGEND, onDragEnd);
  });

  return {
    dragging,
    dragRect
  };
};