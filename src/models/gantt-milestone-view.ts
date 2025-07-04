import { GanttMilestoneViewClassConstructor } from '@/types/gantt-milestone';
import { GanttMilestone } from './gantt-milestone';
import { GanttGroups } from './gantt-groups';

export class GanttMilestoneView extends GanttMilestone {
  x = 0;
  y = 0;
  isShow = true;
  groups: GanttGroups;
  constructor(data:GanttMilestoneViewClassConstructor) {
    super(data);
    this.groups = data.groups;
  }

  calculate() {
    if (!this.isShow) return;
    this.x = (this.datetimeMoment.diff(this.config.startDate, 'second')) * this.config.secondWidth;
    const index = this.groups.getGroupIndex(this.groups.getById(this.group.id)!);
    const top = this.groups.getGroupTopByIndex(index);
    this.y = top + (this.groups.getById(this.group.id)!.height / 2);
  }

  toJSON() {
    return {
      id: this.id,
      text: this.text,
      x: this.x,
      y: this.y,
      isShow: this.isShow,
      groupId: this.group.id,
      datetime: this.datetime
    };
  }
}