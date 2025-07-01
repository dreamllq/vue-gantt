import { GanttGroup } from '@/models/gantt-group';
import { Id } from './id';
import { DateTimeString } from './date';
import { GanttBaseClassConstructor } from './gantt-base';
import { GanttGroups } from '@/models/gantt-groups';
import { SchedulingMode } from './gantt-config';
import { GanttBars } from '@/models/gantt-bars';
import { GanttBus } from '@/models/gantt-bus';
import { GroupId } from './gantt-group';

export type BarId = Id;

export type GanttBarViewClassConstructor = GanttBarClassConstructor & {
  groups: GanttGroups
  bus: GanttBus,
  selectable?:boolean,
  draggable?:boolean
}

export type GanttBarClassConstructor = {
  id: BarId,
  group: GanttGroup,
  start: DateTimeString | null,
  end: DateTimeString | null,
  duration: number | null,
  schedulingMode?: SchedulingMode | null
  bars: GanttBars
} & GanttBaseClassConstructor;

export type GanttBarAddParams = {
  id: BarId,
  groupId: GroupId,
  start: DateTimeString | null,
  end: DateTimeString | null,
  duration: number | null,
  schedulingMode?: SchedulingMode | null,
  selectable?:boolean,
  draggable?:boolean
} 

export type GanttBarUpdateParams = {
  groupId?: GroupId,
  start?: DateTimeString | null,
  end?: DateTimeString | null,
  duration?: number | null,
  schedulingMode?: SchedulingMode | null,
  selectable?:boolean,
  draggable?:boolean
}