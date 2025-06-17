export default class BaseTimeList {
  constructor({
    duration,
    step,
    workTimes,
    unit
  }) {
    this.duration = duration;
    this.step = step;
    this.workTimes = workTimes;
    this.unit = unit;
  }
}