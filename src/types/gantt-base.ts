import { GanttBus } from '@/models/gantt-bus';
import { GanttConfig } from '@/models/gantt-config';
import { GanttLayoutConfig } from '@/models/gantt-layout-config';

export type GanttBaseClassConstructor = {
  config: GanttConfig,
  layoutConfig: GanttLayoutConfig,
  isClone?:boolean
}