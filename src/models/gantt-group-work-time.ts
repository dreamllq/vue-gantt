import { DateTimeString } from '@/types/date';
import { GanttGroupWorkTimeConstructor } from '@/types/gantt-group-work-time';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';

export class GanttGroupWorkTime {
  start: DateTimeString;
  end: DateTimeString;
  id = uuidv4();

  constructor(data:GanttGroupWorkTimeConstructor) {
    this.start = data.start;
    this.end = data.end;
  }

  get startMoment() {
    return moment(this.start, 'YYYY-MM-DD HH:mm:ss');
  }

  get endMoment() {
    return moment(this.end, 'YYYY-MM-DD HH:mm:ss');
  }

  get seconds () {
    return this.endMoment.diff(this.startMoment, 'second');
  }
}