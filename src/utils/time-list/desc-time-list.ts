import BaseTimeList from './base-time-list';
import { strToDate } from '../to-date';
import WorkTime from '../work-times/work-time';
import { dateSubtract } from '../date-subtract';

export default class DescTimeList extends BaseTimeList {
  endDate: Date;

  constructor({
    duration,
    step,
    workTimes,
    unit,
    endDate
  }) {
    super({
      duration,
      step,
      workTimes,
      unit
    });
    this.endDate = strToDate(endDate);
  }

  calculateTimeRange({ workTime, date, residueUnitCount } :{workTime: WorkTime, date: Date, residueUnitCount: number}) : {
    start: Date,
    end: Date,
    unitCount: number,
    isStart: boolean
  } | null {
    const time = date.getTime();
    let end: Date;
    if (workTime.isAfterEnd(time)) {
      end = workTime.endDate;
    } else if (workTime.isAfterAndEqualStart(time) && workTime.isBeforeAndEqualEnd(time)) {
      end = date;
    } else {
      return null;
    }
    const unitCount = workTime.getDescUnitCountByDate(end, this.unit);
    if (residueUnitCount >= unitCount) {
      return {
        start: workTime.startDate,
        end: end,
        unitCount: unitCount,
        isStart: false
      };
    } else {
      const start = dateSubtract(end, residueUnitCount, this.unit);

      return {
        start: start!,
        end: end,
        unitCount: residueUnitCount,
        isStart: true
      };
    }
  }


  calculate({ greed = false } = {}): {
    timeList: {
      start: Date,
      end: Date,
      unitCount: number,
      isStart?: boolean,
      isEnd?: boolean
    }[]
  } {
    let date:Date = this.endDate;
    const allUnitCount = this.duration * this.step;
    let tempUnitCount = 0;
    const timeList:{
      start: Date,
      end: Date,
      unitCount: number,
      isStart?: boolean,
      isEnd?: boolean
    }[] = [];
    this.workTimes.workTimes.reverse();
    const matchedWorkTimes = this.workTimes.workTimes;
    let isMatchWorkTimeStart = false;

    matchedWorkTimes.forEach(workTime => {
      if (isMatchWorkTimeStart) return;
      const tr = this.calculateTimeRange({
        workTime,
        date,
        residueUnitCount: allUnitCount - tempUnitCount 
      });

      if (tr === null) {
        return;
      }

      date = workTime.startDate;
      tempUnitCount += tr.unitCount;
      isMatchWorkTimeStart = tr.isStart;
      
      if (tr.unitCount === 0) {
        if (greed === true) {
          timeList.push(tr);
        }
      } else {
        timeList.push(tr);
      }
    });

    const start = dateSubtract(this.endDate, this.duration * this.step, this.unit);

    if (timeList.length === 0) {
      timeList.push({
        start: start!,
        end: this.endDate,
        unitCount: this.duration * this.step,
        isEnd: true
      });
    }
    return { timeList };
  }
}