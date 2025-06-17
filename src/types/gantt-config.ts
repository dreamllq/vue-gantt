import { GanttLayoutConfig } from '@/models/gantt-layout-config';
import { DateString, SplitTimeString } from './date';
import { Unit } from './unit';

export type GanttConfigClassConstructor = {
  startDate: DateString,
  endDate: DateString,
  daySplitTime?: SplitTimeString,
  durationUnit?: Unit,
  dataScaleUnit?: Unit,
  layoutConfig: GanttLayoutConfig
} 