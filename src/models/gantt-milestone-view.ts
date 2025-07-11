import { GanttMilestoneViewClassConstructor } from '@/types/gantt-milestone';
import { GanttMilestone } from './gantt-milestone';
import { GanttGroups } from './gantt-groups';
import { GroupId } from '@/types/gantt-group';
import { min } from 'lodash';
import { GanttJsonDataMilestone } from '@/types/gantt';
import { dateDiff } from '@/utils/date-diff';
import { strToDate } from '@/utils/to-date';
import { Unit } from '@/types/unit';

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
    
    this.x = dateDiff(strToDate(this.datetime), strToDate(this.config.start), Unit.SECOND) * this.config.secondWidth;
    const index = this.groups.getGroupIndex(this.groups.getById(this.group.id)!);
    const top = this.groups.getGroupTopByIndex(index);
    this.y = top + (this.groups.getById(this.group.id)!.height / 2);
  }

  toUiJSON() {
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

  toJSON():GanttJsonDataMilestone {
    return {
      id: this.id,
      datetime: this.datetime,
      groupId: this.group.id,
      text: this.text
    };
  }
}