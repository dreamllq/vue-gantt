import moment from 'moment';
import BaseTimeList from './base-time-list';

export default class AscTimeList extends BaseTimeList {
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
    this.startDate = moment(startDate, 'YYYY-MM-DD HH:mm:ss');
  }

  calculateTimeRange({ workTime, date, residueUnitCount }) {
    const time = date.unix() * 1000;
    let start = null;
    if (workTime.isBeforeStart(time)) {
      start = workTime.startMoment.clone();
    } else if (workTime.isAfterAndEqualStart(time) && workTime.isBeforeAndEqualEnd(time)) {
      start = date.clone();
    } else {
      return null;
    }
    const unitCount = workTime.getUnitCountByDate(start.clone(), this.unit);
    if (residueUnitCount >= unitCount) {
      return {
        start: start.clone(),
        end: workTime.endMoment,
        unitCount: unitCount,
        isEnd: false
      };
    } else {
      const end = moment(start).add(residueUnitCount, this.unit);
      return {
        start: start.clone(),
        end: end,
        unitCount: residueUnitCount,
        isEnd: true
      };
    }
  }

  calculate({ greed = false } = {}) {
    let date = this.startDate.clone();

    const allUnitCount = this.duration * this.step;
    let tempUnitCount = 0;
    const timeList = [];

    let matchedWorkTimes = this.workTimes.workTimes;
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
      date = workTime.endMoment.clone();
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
      timeList.push({
        start: this.startDate.clone(),
        end: this.startDate.clone().add(this.duration * this.step, this.unit),
        unitCount: this.duration * this.step,
        isEnd: true
      });
    }

    return { timeList };
  }
}