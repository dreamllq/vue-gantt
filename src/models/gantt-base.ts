import { GanttBaseClassConstructor } from '@/types/gantt-base';
import { GanttConfig } from './gantt-config';
import { GanttLayoutConfig } from './gantt-layout-config';
import EventEmitter from '@/utils/eventemitter';

export class GanttBase extends EventEmitter {
  config: GanttConfig;
  layoutConfig: GanttLayoutConfig;
  isClone = false;

  constructor(data : GanttBaseClassConstructor) {
    super();
    this.config = data.config;
    this.layoutConfig = data.layoutConfig;
    this.isClone = !!data.isClone;
  }
}