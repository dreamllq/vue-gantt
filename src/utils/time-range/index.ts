import WorkTimes from '../work-times/work-times';
import DescTimeList from '../time-list/desc-time-list';
import AscTimeList from '../time-list/asc-time-list';
import { max, min } from 'lodash';

export default class TimeRange {
  duration: number;
  step:number;
  workTimes: any;
  unit:any;
  timeList:DescTimeList | AscTimeList | null;
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
  }

  calculateTimeRange({ greed = false } = {}): {start:Date, end: Date} {
    const { timeList }: {
    timeList: {
      start: Date,
      end: Date,
      unitCount: number,
      isStart?: boolean,
      isEnd?: boolean
    }[]
  } = this.timeList!.calculate({ greed });

    const list = timeList.reduce<number[]>((acc, item) => {
      acc.push(item.start.getTime());
      acc.push(item.end.getTime());
      return acc;
    }, []);

    const start = min(list)!;
    const end = max(list)!;
    return {
      start: new Date(start),
      end: new Date(end)
    };
  }
}