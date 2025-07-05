import { Gantt } from '@/models/gantt';
import { useBus } from './bus';
import { GanttConfig } from '@/models/gantt-config';
import { Events } from '@/types/events';
import { GanttBusEvents } from '@/types/gantt-bus';
import { flatten, uniq } from 'lodash';
import asyncFragmentation from 'simple-async-fragmentation';
import { BarId } from '@/types/gantt-bar';
import { GroupId } from '@/types/gantt-group';
import { WorkTimeId } from '@/types/gantt-work-time';
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
    store.bus.emit(Events.GROUPS_CHANGE);
    store.bus.emit(Events.LAYOUT_CHANGE);
    store.bus.emit(Events.SCROLL_CHANGE);
    store.bus.emit(Events.DATE_GRID_CHANGE);
    // store.bus.emit(Events.WORK_TIME_GRID_CHANGE, [data.groupId]);
  });

  ganttEntity.bus.on(GanttBusEvents.GROUP_TOP_CHANGE, (data: GroupId[]) => {
    store.bus.emit(Events.GROUPS_CHANGE);
    store.bus.emit(Events.SCROLL_CHANGE);
    store.bus.emit(Events.LAYOUT_CHANGE);
    store.bus.emit(Events.DATE_GRID_CHANGE);
    // store.bus.emit(Events.WORK_TIME_GRID_CHANGE, data);
  });

  ganttEntity.bus.on(GanttBusEvents.BAR_POS_CHANGE, (ids) => {
    store.bus.emit(Events.BAR_CHANGE, ids);
    store.bus.emit(Events.BAR_POS_CHANGE, ids);
  });

  ganttEntity.bus.on(GanttBusEvents.ATTACHED_BAR_POS_CHANGE, (ids) => {
    store.bus.emit(Events.ATTACHED_BAR_CHANGE, ids);
    store.bus.emit(Events.ATTACHED_BAR_POS_CHANGE, ids);
  });

  ganttEntity.bus.on(GanttBusEvents.BARS_CHANGE, () => {
    store.bus.emit(Events.BARS_CHANGE);
  });

  ganttEntity.bus.on(GanttBusEvents.LINKS_CHANGE, asyncFragmentation<void>(async () => {
    store.bus.emit(Events.LINKS_CHANGE);
    return [];
  }));

  ganttEntity.bus.on(GanttBusEvents.WORK_TIME_CHANGE, asyncFragmentation<WorkTimeId[]>(async (options) => {
    const ids = uniq(flatten(options));
    store.bus.emit(Events.WORK_TIME_CHANGE, ids);
    return [];
  }));

  ganttEntity.bus.on(GanttBusEvents.BAR_CHANGE, asyncFragmentation<BarId[]>(async (options) => {
    const ids = uniq(flatten(options));
    store.bus.emit(Events.BAR_CHANGE, ids);
    return [];
  }));

  ganttEntity.bus.on(GanttBusEvents.BAR_SELECT_CHANGE, asyncFragmentation<BarId[]>(async (options) => {
    const ids = uniq(flatten(options));
    store.bus.emit(Events.BAR_SELECT_CHANGE, ids);
    return [];
  }));

  ganttEntity.bus.on(GanttBusEvents.GROUPS_CHANGE, (data) => {
    store.bus.emit(Events.GROUPS_CHANGE);
    store.bus.emit(Events.GROUP_EXPAND_CHANGE, data);
  });

  ganttEntity.bus.on(GanttBusEvents.ATTACHED_BAR_CHANGE, (data) => {
    store.bus.emit(Events.ATTACHED_BAR_CHANGE, data);
  });

  store.bus.on(Events.BAR_CHANGE, asyncFragmentation<BarId[]>(async (options:BarId[][]) => {
    const ids = uniq(flatten(options));
    store.bus.emit(Events.BAR_CHANGE_FRAGMENTATION, ids);
    return [];
  }));

  store.bus.on(Events.BAR_POS_CHANGE, asyncFragmentation<BarId[]>(async (options:BarId[][]) => {
    const ids = uniq(flatten(options));
    store.bus.emit(Events.BAR_POS_CHANGE_FRAGMENTATION, ids);
    return [];
  }));

  store.bus.on(Events.ATTACHED_BAR_CHANGE, asyncFragmentation<BarId[]>(async (options:BarId[][]) => {
    const ids = uniq(flatten(options));
    store.bus.emit(Events.ATTACHED_BAR_CHANGE_FRAGMENTATION, ids);
    return [];
  }));
  
  store.bus.on(Events.GROUP_EXPAND_CHANGE, (data) => {
    store.bus.emit(Events.SCROLL_CHANGE);
    store.bus.emit(Events.LAYOUT_CHANGE);
    store.bus.emit(Events.DATE_GRID_CHANGE);
    // store.bus.emit(Events.WORK_TIME_GRID_CHANGE, data.newGroupIds);
  });
};