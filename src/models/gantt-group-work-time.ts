import { DateTimeString } from '@/types/date';
import moment from 'moment';

export class GanttGroupWorkTime {
  start: DateTimeString;
  end: DateTimeString;

  constructor(data:{
    start: DateTimeString,
    end: DateTimeString,
  }) {
    this.start = data.start;
    this.end = data.end;
  }

  get startMoment() {
    return moment(this.start, 'YYYY-MM-DD HH:mm:ss');
  }

  get endMoment() {
    return moment(this.end, 'YYYY-MM-DD HH:mm:ss');
  }
}