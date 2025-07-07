import { DateTimeString } from '@/types/date';
import moment from 'moment';
import { GanttGroup } from './gantt-group';
import { GanttBase } from './gantt-base';
import { GanttWorkTimeConstructor, WorkTimeId } from '@/types/gantt-work-time';

export class GanttWorkTime extends GanttBase {
  start: DateTimeString;
  end: DateTimeString;
  id: WorkTimeId;
  group: GanttGroup;
  seconds: number;

  constructor(data:GanttWorkTimeConstructor) {
    super(data);
    this.id = data.id;
    this.start = data.start;
    this.end = data.end;
    this.group = data.group;
    this.seconds = this.endMoment.diff(this.startMoment, 'second');
  }

  get startMoment() {
    return moment(this.start, 'YYYY-MM-DD HH:mm:ss');
  }

  get endMoment() {
    return moment(this.end, 'YYYY-MM-DD HH:mm:ss');
  }
}