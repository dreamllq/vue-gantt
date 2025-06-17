import { GanttBaseClassConstructor } from '@/types/gantt-base';
import { GanttConfig } from './gantt-config';
import { GanttLayoutConfig } from './gantt-layout-config';

export class GanttBase {
  config: GanttConfig;
  layoutConfig: GanttLayoutConfig;

  constructor(data : GanttBaseClassConstructor) {
    this.config = data.config;
    this.layoutConfig = data.layoutConfig;
  }
}