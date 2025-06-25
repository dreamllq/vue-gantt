import { GanttBus } from '@/models/gantt-bus';
import { GanttConfig } from '@/models/gantt-config';
import { GanttGroups } from '@/models/gantt-groups';
import { GanttLayoutConfig } from '@/models/gantt-layout-config';

export type GanttBarsClassConstructor = {
  config: GanttConfig,
  layoutConfig: GanttLayoutConfig,
  groups: GanttGroups,
  bus: GanttBus
}