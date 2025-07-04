import { GanttMilestoneViewClassConstructor } from '@/types/gantt-milestone';
import { BizArray } from './biz-array';
import { GanttMilestoneView } from './gantt-milestone-view';
import { GanttGroup } from './gantt-group';
import { GanttGroups } from './gantt-groups';
import { GanttMilestonesClassConstructor } from '@/types/gantt-milestones';

export class GanttMilestones extends BizArray<GanttMilestoneView> {
  groups:GanttGroups;
  
  constructor(data:GanttMilestonesClassConstructor) {
    super();
    this.groups = data.groups;
  }
  add(data:GanttMilestoneViewClassConstructor) {
    const milestones = new GanttMilestoneView(data);
    this.push(milestones);
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