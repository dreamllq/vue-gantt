import BaseTimeList from './base-time-list.ts';
import { strToDate } from '../to-date';
import WorkTime from '../work-times/work-time';
import { dateAdd } from '../date-add.ts';

export default class AscTimeList extends BaseTimeList {
  startDate: Date;

  constructor({
    duration,
    step,
    workTimes,
    unit,
    startDate
  }) {
    super({
      duration,
      step,
      workTimes,
      unit
    });
    this.startDate = strToDate(startDate);
  }

  calculateTimeRange({ workTime, date, residueUnitCount }:{workTime: WorkTime, date: Date, residueUnitCount: number}) : {
    start: Date,
    end: Date,
    unitCount: number,
    isEnd: boolean
  } | null {
    const time = date.getTime();
    let start: Date;
    if (workTime.isBeforeStart(time)) {
      start = workTime.startDate;
    } else if (workTime.isAfterAndEqualStart(time) && workTime.isBeforeAndEqualEnd(time)) {
      start = date;
    } else {
      return null;
    }
    const unitCount = workTime.getUnitCountByDate(start, this.unit);
    if (residueUnitCount >= unitCount) {
      return {
        start: start,
        end: workTime.endDate,
        unitCount: unitCount,
        isEnd: false
      };
    } else {
      const end = dateAdd(start, residueUnitCount, this.unit);
      
      return {
        start: start,
        end: end!,
        unitCount: residueUnitCount,
        isEnd: true
      };
    }
  }

  calculate({ greed = false } = {}): {
    timeList: {
      start: Date,
      end: Date,
      unitCount: number,
      isEnd: boolean
    }[]
  } {
    let date: Date = this.startDate;

    const allUnitCount = this.duration * this.step;
    let tempUnitCount = 0;
    const timeList:{
      start: Date,
      end: Date,
      unitCount: number,
      isEnd: boolean
    }[] = [];

    const matchedWorkTimes = this.workTimes.workTimes;
    let isMatchWorkTimeEnd = false;
    
    matchedWorkTimes.forEach(workTime => {
      if (isMatchWorkTimeEnd) return;
      const tr = this.calculateTimeRange({
        workTime,
        date,
        residueUnitCount: allUnitCount - tempUnitCount 
      });

      if (tr === null) {
        return;
      }
      date = workTime.endDate;
      tempUnitCount += tr.unitCount;
      isMatchWorkTimeEnd = tr.isEnd;
      
      if (tr.unitCount === 0) {
        if (greed === true) {
          timeList.push(tr);
        }
      } else {
        timeList.push(tr);
      }
    });
    
    if (timeList.length === 0) {
      const end = dateAdd(this.startDate, this.duration * this.step, this.unit);

      timeList.push({
        start: this.startDate,
        end: end!, 
        unitCount: this.duration * this.step,
        isEnd: true
      });
    }

    return { timeList };
  }
}