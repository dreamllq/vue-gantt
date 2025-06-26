import { Id } from '@/types/id';
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useStore } from '../store';
import dom from '@/utils/dom';
import { Events } from '@/types';
import { max } from 'lodash';

type DraggingBar = {
  id: Id,
  sx :number;
  sy :number;
  width :number;
  height :number;
}
export const useSingleDraggingHook = () => {
  const draggingBar = ref<DraggingBar>();
  const dragging = ref({
    startX: 0,
    startY: 0,
    startBarX: 0,
    startBarY: 0,
    startScrollLeft: 0,
    startScrollTop: 0
  });
  const { bus, ganttEntity, scroll, barHtmlClass } = useStore()!;
  const { scrollLeft, scrollTop } = scroll;
  const onDragStart = (e:MouseEvent) => {
    const domPath = dom.getPath(e.target as HTMLElement);
    const barTarget = domPath.find(p => p.classList && p.classList.contains(barHtmlClass)) as HTMLElement;
    if (barTarget) {
      const type = barTarget.dataset.type as string;
      const id = type === 'number' ? Number(barTarget.dataset.id) : barTarget.dataset.id as Id;
      const bar = ganttEntity.bars.getById(id);
      
      if (bar) {
        draggingBar.value = {
          height: bar.height,
          id: bar.id,
          sx: bar.sx,
          sy: bar.sy,
          width: bar.width
        };
        bar.dragging = true;
        bus.emit(Events.BAR_CHANGE, [bar.id]);
        bus.emit(Events.BAR_DRAGGING_CHANGE, [bar.id], true);

        dragging.value.startX = e.x;
        dragging.value.startY = e.y;
        dragging.value.startBarX = bar.sx;
        dragging.value.startBarY = bar.sy;
        dragging.value.startScrollLeft = scrollLeft.value;
        dragging.value.startScrollTop = scrollTop.value;
      }
    }
  };

  const onDrag = (e:MouseEvent) => {
    if (draggingBar.value === undefined) return;
    const offsetX = e.x - dragging.value.startX;
    const offsetY = e.y - dragging.value.startY;

    const tempX = dragging.value.startBarX + offsetX + (scrollLeft.value - dragging.value.startScrollLeft);
    const tempY = dragging.value.startBarY + offsetY + (scrollTop.value - dragging.value.startScrollTop);

    draggingBar.value.sx = tempX;
    draggingBar.value.sy = tempY;
    bus.emit(Events.BAR_DRAGGING, [draggingBar.value.id]);
  };
  const onDragEnd = () => {
    if (draggingBar.value === undefined) return;
    const startTime = ganttEntity.config.startDate.add(Math.floor(draggingBar.value.sx / ganttEntity.config.secondWidth), 'second').format('YYYY-MM-DD HH:mm:ss');
    const endTime = ganttEntity.config.startDate.add(Math.floor((draggingBar.value.sx + draggingBar.value.width) / ganttEntity.config.secondWidth), 'second').format('YYYY-MM-DD HH:mm:ss');

    const index = ganttEntity.groups.getGroupIndexByTop(draggingBar.value.sy);
    const group = ganttEntity.groups.expandedGroups[index];
    const top = ganttEntity.groups.getGroupTopByIndex(index);
    const dropRowIndex = max([Math.floor((draggingBar.value.sy - top) / ganttEntity.layoutConfig.ROW_HEIGHT), 0])!;

    const bar = ganttEntity.bars.getById(draggingBar.value.id)!;
    let recentGroupId:Id|null = null;
    if (bar.group.id !== group.id) {
      recentGroupId = bar.group.id;
      bar.group = group;
    }
    bar.resetTimeRange({
      start: startTime,
      end: endTime
    });
    bar.dragging = false;
    bar.rowIndex = dropRowIndex;
    bar.calculate();
    if (recentGroupId) {
      ganttEntity.bars.calculateGroupOverlap({ groupId: recentGroupId });
    }
    bus.emit(Events.BAR_CHANGE, [bar.id]);
    bus.emit(Events.BAR_DRAGGING_CHANGE, [bar.id], false);
    draggingBar.value = undefined;
  };

  const onMouseOutSide = () => {
    onDragEnd();
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

  return { draggingBar };
};