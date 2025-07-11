import { GanttBase } from './gantt-base';
import { GanttMilestoneClassConstructor, MilestoneId } from '@/types/gantt-milestone';
import { GanttGroup } from './gantt-group';
import { DateTimeString } from '@/types/date';

export class GanttMilestone extends GanttBase {
  id: MilestoneId;
  group: GanttGroup;
  datetime: DateTimeString;
  text:string;
  constructor(data: GanttMilestoneClassConstructor) {
    super(data);
    this.id = data.id;
    this.group = data.group;
    this.datetime = data.datetime;
    this.text = data.text || '';
  }
}