import { Unit } from '@/types/unit';
import WorkTimes from '../work-times/work-times';

export default class BaseTimeList {
  duration: number;
  step: number;
  workTimes: WorkTimes;
  unit: Unit;
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