import { GanttGroup } from '@/models/gantt-group';
import { GanttBaseClassConstructor } from './gantt-base';
import { Id } from './id';
import { GanttBus } from '@/models/gantt-bus';
import { GanttGroups } from '@/models/gantt-groups';
import { GanttConfig } from '@/models/gantt-config';
import { GanttLayoutConfig } from '@/models/gantt-layout-config';

export type GanttAttachedBarsClassConstructor = {
  config: GanttConfig,
  layoutConfig: GanttLayoutConfig,
  groups: GanttGroups,
  bus: GanttBus
}