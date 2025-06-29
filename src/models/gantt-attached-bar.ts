import { GanttBase } from './gantt-base';
import { AttachedBarId, GanttAttachedBarClassConstructor } from '@/types/gantt-attached-bar';
import { GanttGroup } from './gantt-group';
import { DateTimeString } from '@/types/date';

export class GanttAttachedBar extends GanttBase {
  id: AttachedBarId;
  group: GanttGroup;
  start: DateTimeString;
  end: DateTimeString;
  constructor(data: GanttAttachedBarClassConstructor) {
    super(data);
    this.id = data.id;
    this.group = data.group;
    this.start = data.start;
    this.end = data.end;
  }
}