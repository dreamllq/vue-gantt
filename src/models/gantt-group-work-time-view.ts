import { DateTimeString } from '@/types/date';
import moment from 'moment';
import { GanttGroupWorkTime } from './gantt-group-work-time';
import { GanttGroupWorkViewTimeConstructor } from '@/types/gantt-group-work-time';
import { GanttGroupView } from './gantt-group-view';
import { GanttGroup } from './gantt-group';
import { GanttGroups } from './gantt-groups';
import { GanttConfig } from './gantt-config';
import { GroupId } from '@/types/gantt-group';

export class GanttGroupWorkTimeView extends GanttGroupWorkTime {
  sx = 0;
  width = 0;
  groupId:GroupId;
  groups: GanttGroups;
  config: GanttConfig;

  constructor(data:GanttGroupWorkViewTimeConstructor) {
    super(data);
    this.groupId = data.groupId;
    this.groups = data.groups;
    this.config = data.config;
  }

  calculate() {
    if (!this.groups.getById(this.groupId)!.isShow) return;
    this.sx = this.startMoment.diff(this.config.startDate, 'second') * this.config.secondWidth;
    this.width = this.seconds * this.config.secondWidth;
  }

  get startTimeString() {
    return this.startMoment.format('YYYY-MM-DD HH:mm:ss');
  }
}