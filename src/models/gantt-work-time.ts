import { DateTimeString } from '@/types/date';
import { GanttGroup } from './gantt-group';
import { GanttBase } from './gantt-base';
import { GanttWorkTimeConstructor, WorkTimeId } from '@/types/gantt-work-time';
import { strToDate } from '@/utils/to-date';
import { dateDiff } from '@/utils/date-diff';
import { Unit } from '@/types/unit';

export class GanttWorkTime extends GanttBase {
  start: DateTimeString;
  end: DateTimeString;
  id: WorkTimeId;
  group: GanttGroup;
  seconds: number;
  startTimeMills:number;
  endTimeMills: number;

  constructor(data:GanttWorkTimeConstructor) {
    super(data);
    this.id = data.id;
    this.start = data.start;
    this.end = data.end;
    this.group = data.group;
    
    this.seconds = dateDiff(strToDate(this.end), strToDate(this.start), Unit.SECOND);
    this.startTimeMills = strToDate(this.start).getTime();
    this.endTimeMills = strToDate(this.end).getTime();
  }
}