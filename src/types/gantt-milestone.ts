import { GanttGroup } from '@/models/gantt-group';
import { DateTimeString } from './date';
import { GanttBaseClassConstructor } from './gantt-base';
import { Id } from './id';
import { GanttGroups } from '@/models/gantt-groups';
import { GroupId } from './gantt-group';

export type MilestoneId = Id;

export type GanttMilestoneViewClassConstructor = GanttMilestoneClassConstructor &{
  groups: GanttGroups
};

export type GanttMilestoneClassConstructor = {
  id: MilestoneId;
  group: GanttGroup;
  datetime: DateTimeString;
  text?: string;
} & GanttBaseClassConstructor;

export type GanttMilestoneAddParams = {
  id: MilestoneId;
  groupId: GroupId;
  datetime: DateTimeString;
  text?: string;
}