import { GanttGroupWorkViewTimeConstructor } from '@/types/gantt-group-work-time';
import { GanttGroupWorkTime } from './gantt-group-work-time';
import { GanttGroupWorkTimeView } from './gantt-group-work-time-view';
import { BizArray } from './biz-array';

export class GanttGroupWorkTimes extends BizArray<GanttGroupWorkTimeView> {
 
  add(data:GanttGroupWorkViewTimeConstructor) {
    const wtv = new GanttGroupWorkTimeView(data);
    this.push(wtv);
  }

  calculate() {
    this.forEach(item => item.calculate());
  }
}