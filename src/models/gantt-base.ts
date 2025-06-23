import { GanttBaseClassConstructor } from '@/types/gantt-base';
import { GanttConfig } from './gantt-config';
import { GanttLayoutConfig } from './gantt-layout-config';
import EventEmitter from '@/utils/eventemitter';

export class GanttBase extends EventEmitter {
  config: GanttConfig;
  layoutConfig: GanttLayoutConfig;

  constructor(data : GanttBaseClassConstructor) {
    super();
    this.config = data.config;
    this.layoutConfig = data.layoutConfig;
  }
}