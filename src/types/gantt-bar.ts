import { GanttGroup } from '@/models/gantt-group';
import { Id } from './id';
import { DateTimeString } from './date';
import { GanttBaseClassConstructor } from './gantt-base';
import { GanttGroups } from '@/models/gantt-groups';
import { SchedulingMode } from './gantt-config';
import { GanttBars } from '@/models/gantt-bars';
import { GanttBus } from '@/models/gantt-bus';

export type BarId = Id;

export type GanttBarViewClassConstructor = GanttBarClassConstructor & {
  groups: GanttGroups
  bars: GanttBars
  bus: GanttBus,
  isClone?:boolean
}

export type GanttBarClassConstructor = {
  id: BarId,
  group: GanttGroup,
  start: DateTimeString | null,
  end: DateTimeString | null,
  duration: number | null,
  schedulingMode?: SchedulingMode | null
} & GanttBaseClassConstructor;

export type GanttBarAddParams = {
  id: BarId,
  group: GanttGroup,
  start: DateTimeString | null,
  end: DateTimeString | null,
  duration: number | null,
  schedulingMode?: SchedulingMode | null
}