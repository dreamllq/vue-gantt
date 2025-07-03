import { GanttGroup } from '@/models/gantt-group';
import { DateTimeString } from './date';
import { GanttGroups } from '@/models/gantt-groups';
import { GanttConfig } from '@/models/gantt-config';
import { GroupId } from './gantt-group';


export type GanttGroupWorkViewTimeConstructor = GanttGroupWorkTimeConstructor &{
  groupId: GroupId,
  groups: GanttGroups,
  config: GanttConfig
}

export type GanttGroupWorkTimeConstructor = {
  start: DateTimeString;
  end: DateTimeString;
}