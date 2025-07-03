import { GanttMilestoneViewClassConstructor } from '@/types/gantt-milestone';
import { BizArray } from './biz-array';
import { GanttMilestoneView } from './gantt-milestone-view';

export class GanttMilestones extends BizArray<GanttMilestoneView> {

  add(data:GanttMilestoneViewClassConstructor) {
    const milestones = new GanttMilestoneView(data);
    this.push(milestones);
  }

  calculate() {
    this.forEach(item => item.calculate());
  }
}