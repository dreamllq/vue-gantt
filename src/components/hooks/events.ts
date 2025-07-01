import { Gantt } from '@/models/gantt';
import { useBus } from './bus';
import { GanttConfig } from '@/models/gantt-config';
import { Events } from '@/types/events';
import { GanttBusEvents } from '@/types/gantt-bus';
import { flatten, uniq } from 'lodash';
import asyncFragmentation from 'simple-async-fragmentation';
import { BarId } from '@/types/gantt-bar';

export const useEvents = (ganttEntity: Gantt, store:{
  bus: ReturnType<typeof useBus>
}) => {

  ganttEntity.config.on(GanttConfig.Events.DRAGGABLE_CHANGE, (val) => {
    store.bus.emit(Events.DRAGGABLE_CHANGE, val);
  });

  ganttEntity.config.on(GanttConfig.Events.SELECTABLE_CHANGE, (val) => {
    store.bus.emit(Events.SELECTABLE_CHANGE, val);
  });

  ganttEntity.config.on(GanttConfig.Events.MULTIPLE_SELECTABLE_CHANGE, (val) => {
    store.bus.emit(Events.MULTIPLE_SELECTABLE_CHANGE, val);
  });



  ganttEntity.bus.on(GanttBusEvents.GROUP_HEIGHT_CHANGE, (data) => {
    store.bus.emit(Events.GROUP_CHANGE, [data.groupId]);
    store.bus.emit(Events.SCROLL_CHANGE);
    store.bus.emit(Events.LAYOUT_CHANGE);
    store.bus.emit(Events.DATE_GRID_CHANGE);
    store.bus.emit(Events.WORK_TIME_GRID_CHANGE);
  });

  ganttEntity.bus.on(GanttBusEvents.GROUP_TOP_CHANGE, (data) => {
    store.bus.emit(Events.GROUP_CHANGE, data);
    store.bus.emit(Events.SCROLL_CHANGE);
    store.bus.emit(Events.LAYOUT_CHANGE);
    store.bus.emit(Events.DATE_GRID_CHANGE);
    store.bus.emit(Events.WORK_TIME_GRID_CHANGE);
  });

  ganttEntity.bus.on(GanttBusEvents.BAR_POS_CHANGE, (ids) => {
    store.bus.emit(Events.BAR_CHANGE, ids);
    store.bus.emit(Events.BAR_POS_CHANGE, ids);
  });

  ganttEntity.bus.on(GanttBusEvents.ATTACHED_BAR_POS_CHANGE, (ids) => {
    store.bus.emit(Events.ATTACHED_BAR_CHANGE, ids);
    store.bus.emit(Events.ATTACHED_BAR_POS_CHANGE, ids);
  });

  store.bus.on(Events.BAR_CHANGE, asyncFragmentation<BarId[]>(async (options:BarId[][]) => {
    const ids = uniq(flatten(options));
    store.bus.emit(Events.BAR_CHANGE_FRAGMENTATION, ids);
    return [];
  }));
  
  store.bus.on(Events.GROUP_EXPAND_CHANGE, () => {
    store.bus.emit(Events.SCROLL_CHANGE);
    store.bus.emit(Events.LAYOUT_CHANGE);
    store.bus.emit(Events.DATE_GRID_CHANGE);
    store.bus.emit(Events.WORK_TIME_GRID_CHANGE);
  });
};