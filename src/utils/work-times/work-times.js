import WorkTime from './work-time';

const workTimeMap = {};


export default class WorkTimes {
  constructor({ workTimes = [] }) {
    this.workTimes = workTimes.map(workTime => {
      const key = `${workTime.start}_${workTime.end}`;
      if (!workTimeMap[key]) {
        workTimeMap[key] = new WorkTime(workTime);
      }
      return workTimeMap[key];
    });
  }
  
  getMatched(date) {
    const time = date.unix() * 1000;
    return this.workTimes.filter(workTime => workTime.isMatched(time));
  }
}