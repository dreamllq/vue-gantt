import WorkTime from './work-time';
import { TimeRange } from '@/types/utils';

const workTimeMap = {};


export default class WorkTimes {
  workTimes: WorkTime[];
  constructor({ workTimes = [] }:{workTimes: WorkTime[]}) {
    this.workTimes = workTimes.map(workTime => {
      const key = `${workTime.start}_${workTime.end}`;
      if (!workTimeMap[key]) {
        workTimeMap[key] = new WorkTime(workTime);
      }
      return workTimeMap[key];
    });
  }
  
  getMatched(date:Date) {
    const time = date.getTime();
    return this.workTimes.filter(workTime => workTime.isMatched(time));
  }
}