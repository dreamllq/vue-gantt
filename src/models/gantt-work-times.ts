import { GanttWorkViewTimeConstructor } from '@/types/gantt-work-time';
import { BizArray } from './biz-array';
import { GanttWorkTimeView } from './gantt-work-time-view';
import { GanttConfig } from './gantt-config';
import { GanttGroups } from './gantt-groups';
import { GanttWorkTimesClassConstructor } from '@/types/gantt-work-times';

export class GanttWorkTimes extends BizArray<GanttWorkTimeView> {
  config: GanttConfig;
  groups: GanttGroups;

  constructor(data:GanttWorkTimesClassConstructor) {
    super();
    this.config = data.config;
    this.groups = data.groups;
  }
 
  add(data:GanttWorkViewTimeConstructor) {
    const wtv = new GanttWorkTimeView(data);
    this.push(wtv);
    this.groups.getById(wtv.group.id)!.workTimes.push(wtv);
  }

  calculate() {
    this.forEach(item => item.calculate());
  }

  updateShow() {
    this.forEach(bar => {
      bar.isShow = this.groups.getById(bar.group.id)!.isShow;
    });
  }
}