import moment from 'moment';
const map = {};
const timeMap = {};
export default class WorkTime {
  constructor({ start, end }) {
    this.start = start;
    this.end = end;
  }

  get startMoment() {
    if (!map[this.start]) {
      map[this.start] = moment(this.start, 'YYYY-MM-DD HH:mm:ss');
    }
    return map[this.start];
  }

  get startTime() {
    if (!timeMap[this.start]) {
      timeMap[this.start] = this.startMoment.unix() * 1000;
    }
    return timeMap[this.start];
  }

  get endMoment() {
    if (!map[this.end]) {
      map[this.end] = moment(this.end, 'YYYY-MM-DD HH:mm:ss');
    }
    return map[this.end];
  }

  get endTime() {
    if (!timeMap[this.end]) {
      timeMap[this.end] = this.endMoment.unix() * 1000;
    }
    return timeMap[this.end];
  }

  isMatched(time) {
    return !this.isAfterEnd(time);
  }

  isBeforeStart(time) {
    return time < this.startTime;
  }

  isBeforeAndEqualEnd(time) {
    return time <= this.endTime;
  }

  isAfterEnd(time) {
    return time > this.endTime;
  }
  isAfterAndEqualEnd(time) {
    return time >= this.endTime;
  }

  isAfterStart(time) {
    return time > this.startTime;
  }
  
  isAfterAndEqualStart(time) {
    return time >= this.startTime;
  }

  getUnitCount(unit) {
    return this.endMoment.diff(this.startMoment, unit);
  }

  getUnitCountByDate(date, unit) {
    return this.endMoment.diff(date, unit);
  }

  getDescUnitCountByDate(date, unit) {
    return date.diff(this.startMoment, unit);
  }
}