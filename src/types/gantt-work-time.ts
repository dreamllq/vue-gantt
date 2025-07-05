import { GanttGroup } from '@/models/gantt-group';
import { DateTimeString } from './date';
import { GanttGroups } from '@/models/gantt-groups';
import { GanttConfig } from '@/models/gantt-config';
import { GroupId } from './gantt-group';
import { Id } from './id';
import { GanttBaseClassConstructor } from './gantt-base';

export type WorkTimeId = Id;

export type GanttWorkViewTimeConstructor = GanttWorkTimeConstructor & {
  groups: GanttGroups,
  config: GanttConfig
}

export type GanttWorkTimeConstructor = {
  id: WorkTimeId,
  start: DateTimeString;
  end: DateTimeString;
  group: GanttGroup;
} & GanttBaseClassConstructor;


export type GanttWorkTimeAddParams = {
  id: WorkTimeId,
  start: DateTimeString;
  end: DateTimeString;
  groupId: GroupId;
} 