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

  ganttEntity.bus.on(GanttBusEvents.BAR_POS_CHANGE, (ids) => {
    store.bus.emit(Events.BAR_CHANGE, ids);
    store.bus.emit(Events.BAR_POS_CHANGE, ids);
  });

  ganttEntity.config.on(GanttConfig.EVENTS.DRAGGABLE_CHANGE, (val) => {
    store.bus.emit(Events.DRAGGABLE_CHANGE, val);
  });

  ganttEntity.config.on(GanttConfig.EVENTS.SELECTABLE_CHANGE, (val) => {
    store.bus.emit(Events.SELECTABLE_CHANGE, val);
  });

  ganttEntity.config.on(GanttConfig.EVENTS.CHECKABLE_CHANGE, (val) => {
    store.bus.emit(Events.CHECKABLE_CHANGE, val);
  });

  store.bus.on(Events.BAR_CHANGE, asyncFragmentation<BarId[]>(async (options:BarId[][]) => {
    const ids = uniq(flatten(options));
    store.bus.emit(Events.BAR_CHANGE_FRAGMENTATION, ids);
    return [];
  }));
  
  ganttEntity.bus.on(GanttBusEvents.GROUP_ROWS_CHANGE, (data) => {
    store.bus.emit(Events.BAR_CHANGE, data.effectBarIds);
    store.bus.emit(Events.GROUP_CHANGE, [data.groupId]);
    store.bus.emit(Events.SCROLL_CHANGE);
    store.bus.emit(Events.LAYOUT_CHANGE);
    store.bus.emit(Events.DATE_GRID_CHANGE);
    store.bus.emit(Events.WORK_TIME_GRID_CHANGE);
    store.bus.emit(Events.BAR_POS_CHANGE, data.effectBarIds);
    store.bus.emit(Events.BAR_VISIBLE_CHANGE);
  });

  store.bus.on(Events.GROUP_EXPAND_CHANGE, () => {
    store.bus.emit(Events.SCROLL_CHANGE);
    store.bus.emit(Events.LAYOUT_CHANGE);
    store.bus.emit(Events.DATE_GRID_CHANGE);
    store.bus.emit(Events.WORK_TIME_GRID_CHANGE);
  });
};