import { GanttLayoutConfig } from '@/models/gantt-layout-config';
import { DateString, SplitTimeString } from './date';
import { Unit } from './unit';
import { LinkShowStrategy } from './gantt-link';

export enum SchedulingMode {
  FORWARD='FORWARD',
  BACKWARD='BACKWARD'
}

export type GanttConfigClassConstructor = {
  startDate: DateString,
  endDate: DateString,
  daySplitTime?: SplitTimeString,
  durationUnit?: Unit,
  dataScaleUnit?: Unit,
  layoutConfig: GanttLayoutConfig,
  lazyDebounceTime?: number,
  schedulingMode?: SchedulingMode,
  draggable?:boolean,
  selectable?:boolean,
  checkable?:boolean,
  multipleDraggable?:boolean,
  linkShowStrategy?:LinkShowStrategy
} 