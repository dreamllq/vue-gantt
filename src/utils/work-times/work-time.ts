import { strToDate } from '../to-date';
import { Unit } from '@/types/unit';
import { dateDiff } from '../date-diff';
export default class WorkTime {
  start: string;
  end: string;
  startDate: Date;
  endDate: Date;
  startTime: number;
  endTime: number;

  constructor({ start, end }) {
    this.start = start;
    this.end = end;
    this.startDate = strToDate(this.start);
    this.endDate = strToDate(this.end);
    this.startTime = this.startDate.getTime();
    this.endTime = this.endDate.getTime();
  }

  isMatched(time: number) {
    return !this.isAfterEnd(time);
  }

  isBeforeStart(time: number) {
    return time < this.startTime;
  }

  isBeforeAndEqualEnd(time: number) {
    return time <= this.endTime;
  }

  isAfterEnd(time: number) {
    return time > this.endTime;
  }
  isAfterAndEqualEnd(time: number) {
    return time >= this.endTime;
  }

  isAfterStart(time: number) {
    return time > this.startTime;
  }
  
  isAfterAndEqualStart(time: number) {
    return time >= this.startTime;
  }

  getUnitCount(unit:Unit) {
    return dateDiff(this.startDate, this.endDate, unit);
  }

  getUnitCountByDate(date:Date, unit:Unit) {
    return dateDiff(this.endDate, date, unit);
  }

  getDescUnitCountByDate(date:Date, unit:Unit) {
    return dateDiff(date, this.startDate, unit);
  }
}