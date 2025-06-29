import { GanttGroup } from '@/models/gantt-group';
import { GanttBaseClassConstructor } from './gantt-base';
import { Id } from './id';
import { GanttBus } from '@/models/gantt-bus';
import { GanttGroups } from '@/models/gantt-groups';
import { GanttAttachedBars } from '@/models/gantt-attached-bars';
import { DateTimeString } from './date';

export type AttachedBarId = Id;

export type GanttAttachedBarViewClassConstructor = GanttAttachedBarClassConstructor & {
  groups: GanttGroups
  attachedBars: GanttAttachedBars
  bus: GanttBus
}

export type GanttAttachedBarClassConstructor = {
  id: AttachedBarId,
  group: GanttGroup,
  start: DateTimeString,
  end: DateTimeString,
} & GanttBaseClassConstructor;

export type GanttAttachedBarAddParams = {
  id: AttachedBarId,
  group: GanttGroup,
  start: DateTimeString,
  end: DateTimeString
}