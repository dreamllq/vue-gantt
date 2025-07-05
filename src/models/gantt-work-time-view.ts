import { DateTimeString } from '@/types/date';
import moment from 'moment';
import { GanttGroupView } from './gantt-group-view';
import { GanttGroup } from './gantt-group';
import { GanttGroups } from './gantt-groups';
import { GanttConfig } from './gantt-config';
import { GroupId } from '@/types/gantt-group';
import { GanttWorkTime } from './gantt-work-time';
import { GanttWorkViewTimeConstructor } from '@/types/gantt-work-time';

export class GanttWorkTimeView extends GanttWorkTime {
  sx = 0;
  width = 0;
  groups: GanttGroups;
  config: GanttConfig;

  constructor(data:GanttWorkViewTimeConstructor) {
    super(data);
    this.groups = data.groups;
    this.config = data.config;
  }

  calculate() {
    if (!this.groups.getById(this.group.id)!.isShow) return;
    this.sx = this.startMoment.diff(this.config.startDate, 'second') * this.config.secondWidth;
    this.width = this.seconds * this.config.secondWidth;
  }

  get startTimeString() {
    return this.startMoment.format('YYYY-MM-DD HH:mm:ss');
  }
}