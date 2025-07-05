import { GanttBus } from '@/models/gantt-bus';
import { GanttConfig } from '@/models/gantt-config';
import { GanttGroups } from '@/models/gantt-groups';

export type GanttWorkTimesClassConstructor = {
  config: GanttConfig,
  groups: GanttGroups,
  bus: GanttBus
}