import { DateTimeString } from '@/types/date';

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
}