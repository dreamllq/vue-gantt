import moment from 'moment';
import BaseTimeList from './base-time-list';

export default class DescTimeList extends BaseTimeList {
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
    this.endDate = moment(endDate, 'YYYY-MM-DD HH:mm:ss');
  }

  calculateTimeRange({ workTime, date, residueUnitCount }) {
    const time = date.unix() * 1000;
    let end = null;
    if (workTime.isAfterEnd(time)) {
      end = workTime.endMoment.clone();
    } else if (workTime.isAfterAndEqualStart(time) && workTime.isBeforeAndEqualEnd(time)) {
      end = date.clone();
    } else {
      return null;
    }
    const unitCount = workTime.getDescUnitCountByDate(end.clone(), this.unit);
    if (residueUnitCount >= unitCount) {
      return {
        start: workTime.startMoment,
        end: end.clone(),
        unitCount: unitCount,
        isStart: false
      };
    } else {
      const start = moment(end).subtract(residueUnitCount, this.unit);
      return {
        start: start,
        end: end.clone(),
        unitCount: residueUnitCount,
        isStart: true
      };
    }
  }


  calculate({ greed = false } = {}) {
    let date = this.endDate.clone();
    const allUnitCount = this.duration * this.step;
    let tempUnitCount = 0;
    const timeList = [];
    this.workTimes.workTimes.reverse();
    let matchedWorkTimes = this.workTimes.workTimes;
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

      date = workTime.startMoment.clone();
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

    if (timeList.length === 0) {
      timeList.push({
        start: this.endDate.clone().subtract(this.duration * this.step, this.unit),
        end: this.endDate.clone(),
        unitCount: this.duration * this.step,
        isEnd: true
      });
    }
    return { timeList };
  }
}