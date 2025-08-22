import { GanttBus } from '@/models/gantt-bus';
import { GanttConfig } from '@/models/gantt-config';
import { GanttContainer } from '@/models/gantt-container';
import { GanttLayoutConfig } from '@/models/gantt-layout-config';

export type GanttGroupsClassConstructor = {
  config: GanttConfig,
  layoutConfig: GanttLayoutConfig,
  bus: GanttBus,
  container: GanttContainer;
}