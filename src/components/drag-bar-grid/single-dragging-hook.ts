import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useStore } from '../store';
import { Events } from '@/types/events';
import { max, min } from 'lodash';
import { GanttBarView } from '@/models/gantt-bar-view';
import { BarId } from '@/types/gantt-bar';
import { roundDownTimeToNearestSeconds } from '@/utils/round-down-time-to-nearest-seconds';
import { dateAdd } from '@/utils/date-add';
import { strToDate } from '@/utils/to-date';
import { Unit } from '@/types/unit';
import { dateTimeFormat } from '@/utils/date-time-format';
import { SchedulingMode } from '@/types/gantt-config';

type DraggingBar = {
  id: BarId,
  sx :number;
  sy :number;
  width :number;
  height :number;
  schedulingMode: SchedulingMode
}
export const useSingleDraggingHook = () => {
  const draggingBar = ref<DraggingBar>();
  const shadowDraggingBar = ref<DraggingBar>();
  const barClone = ref<GanttBarView>();
  const dragging = ref({
    startX: 0,
    startY: 0,
    startBarX: 0,
    startBarY: 0,
    startScrollLeft: 0,
    startScrollTop: 0,
    offsetX: 0,
    offsetY: 0
  });
  const { bus, ganttEntity, scroll, barHtmlClass } = useStore()!;
  const { scrollLeft, scrollTop } = scroll;
  const onDragStart = async (e:MouseEvent, bar: GanttBarView) => {
    // hook.beforeDragStart
    if (ganttEntity.hook?.beforeDragStart) {
      const flag = await ganttEntity.hook.beforeDragStart({
        barId: bar.id,
        groupId: bar.group.id,
        start: bar.start!,
        end: bar.end! 
      });
      if (flag !== true) {
        return;
      }
    }

    draggingBar.value = {
      height: bar.height,
      id: bar.id,
      sx: bar.sx,
      sy: bar.sy,
      width: bar.width,
      schedulingMode: bar.schedulingMode
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
    dragging.value.offsetX = scrollLeft.value;
    dragging.value.offsetY = scrollTop.value;

    barClone.value = bar.clone();
    calculateBarClone();
    shadowDraggingBar.value = {
      height: barClone.value.height,
      id: barClone.value.id,
      sx: barClone.value.sx,
      sy: barClone.value.sy,
      width: barClone.value.width,
      schedulingMode: barClone.value.schedulingMode
    };
  };

  const onDrag = (e:MouseEvent) => {
    if (draggingBar.value === undefined) return;
    if (!barClone.value) return;
    const offsetX = e.x - dragging.value.startX;
    const offsetY = e.y - dragging.value.startY;

    const tempX = dragging.value.startBarX + offsetX + (scrollLeft.value - dragging.value.startScrollLeft);
    const tempY = dragging.value.startBarY + offsetY + (scrollTop.value - dragging.value.startScrollTop);

    draggingBar.value.sx = tempX;
    draggingBar.value.sy = tempY;
    bus.emit(Events.BAR_DRAGGING, [draggingBar.value.id]);
    calculateBarClone();
    shadowDraggingBar.value = {
      height: barClone.value.height,
      id: barClone.value.id,
      sx: barClone.value.sx,
      sy: barClone.value.sy,
      width: barClone.value.width,
      schedulingMode: barClone.value.schedulingMode
    };
  };
  const onDragEnd = async (e:MouseEvent, bar:GanttBarView) => {
    if (draggingBar.value === undefined) return;

    const dropX = draggingBar.value.sx;
    const dropY = draggingBar.value.sy + (ganttEntity.layoutConfig.BAR_HEIGHT / 2);
    const startTime = dateTimeFormat(
      roundDownTimeToNearestSeconds(
        dateAdd(
          strToDate(ganttEntity.config.start), 
          Math.floor(dropX / ganttEntity.config.secondWidth),
          Unit.SECOND
        ), 
        ganttEntity.config.dragTimeOffset
      )
    );
    
    const endTime = dateTimeFormat(
      roundDownTimeToNearestSeconds(
        dateAdd(
          strToDate(ganttEntity.config.start), 
          Math.floor((dropX + draggingBar.value.width) / ganttEntity.config.secondWidth), 
          Unit.SECOND
        ), 
        ganttEntity.config.dragTimeOffset
      )
    );

    const index = ganttEntity.groups.getGroupIndexByTop(dropY);
    const group = ganttEntity.groups.expandedGroups[index];
    const top = ganttEntity.groups.getGroupTopByIndex(index);
    const dropRowIndex = max([Math.floor(min([(dropY - top), group.barsHeight - 1])! / ganttEntity.layoutConfig.ROW_HEIGHT), 0])!;


    // hook.beforeDragEnd
    if (ganttEntity.hook?.beforeDragEnd) {
      const flag = await ganttEntity.hook.beforeDragEnd({
        barId: bar.id,
        end: endTime,
        start: startTime,
        groupId: group.id
      }, { 
        barId: bar.id,
        groupId: bar.group.id,
        start: bar.start!,
        end: bar.end!
      });

      if (flag !== true) {
        bar.dragging = false;
        bus.emit(Events.BAR_DRAGGING_CHANGE, [bar.id], false);
        draggingBar.value = undefined;
        barClone.value = undefined;
        shadowDraggingBar.value = undefined;
        bus.emit(Events.BAR_CHANGE, [bar.id]);
        return;
      }
    }
        
    bar.dragging = false;
    // bar.sx = barClone.value!.sx;
    // bar.sy = barClone.value!.sy;
    // bar.ex = barClone.value!.ex;
    // bar.ey = barClone.value!.ey;
    // bar.width = barClone.value!.width;
    // bar.height = barClone.value!.height;
    // bus.emit(Events.BAR_CHANGE, [bar.id]);
    // setTimeout(() => {
    bar.update({
      end: endTime,
      start: startTime,
      rowIndex: group.barOverlap === true ? 0 : dropRowIndex,
      groupId: group.id
    });
    // }, 0);
    bus.emit(Events.BAR_DRAGGING_CHANGE, [bar.id], false);

    draggingBar.value = undefined;
    barClone.value = undefined;
    shadowDraggingBar.value = undefined;
  };

  const calculateBarClone = () => {
    if (draggingBar.value === undefined) return;
    if (!barClone.value) return;
    const dropX = draggingBar.value.sx;
    const dropY = draggingBar.value.sy + (ganttEntity.layoutConfig.BAR_HEIGHT / 2);
    
    const startTime = dateTimeFormat(
      roundDownTimeToNearestSeconds(
        dateAdd(
          strToDate(ganttEntity.config.start), 
          Math.floor(dropX / ganttEntity.config.secondWidth), 
          Unit.SECOND
        ), 
        ganttEntity.config.dragTimeOffset
      )
    );
    const endTime = dateTimeFormat(
      roundDownTimeToNearestSeconds(
        dateAdd(
          strToDate(ganttEntity.config.start), 
          Math.floor((dropX + draggingBar.value.width) / ganttEntity.config.secondWidth), 
          Unit.SECOND
        ), 
        ganttEntity.config.dragTimeOffset)
    );
    const index = ganttEntity.groups.getGroupIndexByTop(dropY);
    const group = ganttEntity.groups.expandedGroups[index];
    const top = ganttEntity.groups.getGroupTopByIndex(index);
    const dropRowIndex = max([Math.floor(min([(dropY - top), group.barsHeight - 1])! / ganttEntity.layoutConfig.ROW_HEIGHT), 0])!;
    
    barClone.value.group = group;
    barClone.value.start = startTime;
    barClone.value.end = endTime;
    barClone.value.resetTimeRange();
    barClone.value.rowIndex = group.barOverlap === true ? 0 : dropRowIndex;
    barClone.value.calculatePos();
    barClone.value.changeY();
  };

  onMounted(() => {
    bus.on(Events.BAR_DRAGSTART, onDragStart);
    bus.on(Events.BAR_DRAG, onDrag);
    bus.on(Events.BAR_DRAGEND, onDragEnd);
  });

  onBeforeUnmount(() => {
    bus.off(Events.BAR_DRAGSTART, onDragStart);
    bus.off(Events.BAR_DRAG, onDrag);
    bus.off(Events.BAR_DRAGEND, onDragEnd);
  });

  return {
    draggingBar,
    shadowDraggingBar,
    barClone
  };
};