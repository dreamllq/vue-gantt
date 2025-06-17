import { cloneDeep } from 'lodash';
import WorkTimes from '../work-times/work-times';
import moment from 'moment';
import DescTimeList from '../time-list/desc-time-list';
import AscTimeList from '../time-list/asc-time-list';

export default class TimeRange {
  duration: number;
  step:number;
  workTimes: any;
  unit:any;
  timeList:any;
  // workTimeList;
  constructor({
    startDate,
    duration,
    step,
    workTimes,
    unit, endDate
  }:{
    startDate?:string,
    duration:number,
    step:number,
    workTimes:any[],
    unit:any, 
    endDate?:string
  }) {
    this.duration = duration;
    this.step = step || 1;
    this.workTimes = new WorkTimes({ workTimes });
    this.unit = unit;
    if (endDate && !startDate) {
      this.timeList = new DescTimeList({
        duration,
        step,
        workTimes: this.workTimes,
        unit,
        endDate
      });
    } else if (startDate && !endDate) {
      this.timeList = new AscTimeList({
        duration,
        step,
        workTimes: this.workTimes,
        unit,
        startDate
      });
    } else {
      console.error('时间参数异常');
      this.timeList = null;
    }
    // this.workTimeList = [];
  }

  // get holidayTimeList () {
  //   let pre = null;
  //   return this.workTimeList.reduce((acc, item) => {
  //     if (pre) {
  //       acc.push({
  //         start: pre.end.clone(),
  //         end: item.start.clone(),
  //         isEdge: pre.unitCount === 0 || item.unitCount === 0
  //       });
  //     } 
  //     pre = item;
  //     return acc;
  //   }, []);
  // }


  calculateTimeRange({ greed = false } = {}) {
    const { timeList } = this.timeList!.calculate({ greed });

    const momentList = timeList.reduce((acc, item) => {
      acc.push(item.start);
      acc.push(item.end);
      return acc;
    }, []);
    // this.workTimeList = timeList;

    const start = moment.min(momentList);
    const end = moment.max(momentList);
    return {
      start: start.clone(),
      end: end.clone()
    };
  }
}