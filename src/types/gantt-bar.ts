import { GanttGroup } from '@/models/gantt-group';
import { Id } from './id';
import { DateTimeString } from './date';
import { GanttBaseClassConstructor } from './gantt-base';
import { GanttGroups } from '@/models/gantt-groups';

export type GanttBarViewClassConstructor = GanttBarClassConstructor & {
  groups: GanttGroups
}

export type GanttBarClassConstructor = {
  id: Id,
  group: GanttGroup,
  start: DateTimeString | null,
  end: DateTimeString | null,
  duration: number | null
} & GanttBaseClassConstructor;

export type GanttBarAddParams = {
  id: Id,
  group: GanttGroup,
  start: DateTimeString | null,
  end: DateTimeString | null,
  duration: number | null
}