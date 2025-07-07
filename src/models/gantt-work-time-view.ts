import { DateTimeString } from '@/types/date';
import moment from 'moment';
import { GanttGroupView } from './gantt-group-view';
import { GanttGroup } from './gantt-group';
import { GanttGroups } from './gantt-groups';
import { GanttConfig } from './gantt-config';
import { GroupId } from '@/types/gantt-group';
import { GanttWorkTime } from './gantt-work-time';
import { GanttWorkViewTimeConstructor } from '@/types/gantt-work-time';
import { GanttJsonDataWorkTime } from '@/types/gantt';

export class GanttWorkTimeView extends GanttWorkTime {
  sx = 0;
  sy = 0;
  width = 0;
  height = 0;
  groups: GanttGroups;
  config: GanttConfig;
  isShow = true;
  startTimeString: string;

  constructor(data:GanttWorkViewTimeConstructor) {
    super(data);
    this.groups = data.groups;
    this.config = data.config;
    this.startTimeString = this.startMoment.format('YYYY-MM-DD HH:mm:ss');
  }

  calculate() {
    this.sx = this.startMoment.diff(this.config.startDate, 'second') * this.config.secondWidth;
    this.width = this.seconds * this.config.secondWidth;
    if (!this.isShow) {
      this.sy = 0;
      this.height = 0;
    } else {
      this.height = this.groups.getById(this.group.id)!.height;
      this.sy = this.groups.getGroupTopByIndex(this.groups.getGroupIndex(this.groups.getById(this.group.id)!));
    }
  }

  updateY() {
    if (!this.isShow) {
      this.sy = 0;
      this.height = 0;
    } else {
      this.height = this.groups.getById(this.group.id)!.height;
      this.sy = this.groups.getGroupTopByIndex(this.groups.getGroupIndex(this.groups.getById(this.group.id)!));
    }
  }

  toJSON():GanttJsonDataWorkTime {
    return {
      id: this.id,
      start: this.start,
      end: this.end,
      groupId: this.group.id
    };
  }
}