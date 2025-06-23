import { Gantt } from '@/models/gantt';
import { useBus } from './bus';
import { GanttConfig } from '@/models/gantt-config';
import { Events } from '@/types/events';

export const useEvents = (ganttEntity: Gantt, store:{
  bus: ReturnType<typeof useBus>
}) => {
  ganttEntity.config.on(GanttConfig.EVENTS.DRAGGABLE_CHANGE, (val) => {
    store.bus.emit(Events.DRAGGABLE_CHANGE, val);
  });

  ganttEntity.config.on(GanttConfig.EVENTS.SELECTABLE_CHANGE, (val) => {
    store.bus.emit(Events.SELECTABLE_CHANGE, val);
  });

  ganttEntity.config.on(GanttConfig.EVENTS.CHECKABLE_CHANGE, (val) => {
    store.bus.emit(Events.CHECKABLE_CHANGE, val);
  });
};