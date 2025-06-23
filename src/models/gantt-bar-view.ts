import { GanttBarViewClassConstructor } from '@/types/gantt-bar';
import { GanttBar } from './gantt-bar';
import { GanttGroups } from './gantt-groups';
import { computeTimeSecond } from '@/utils/compute-time-second';
import moment from 'moment';

export class GanttBarView extends GanttBar {
  sx = 0;
  ex = 0;
  width = 0;
  sy = 0;
  ey = 0;
  height = 0;
  st = 0;
  et = 0;
  dragging = false;
  selected = false;
  groups:GanttGroups;
  
  constructor(data:GanttBarViewClassConstructor) {
    super(data);
    this.groups = data.groups;
  }

  get startMoment() {
    return moment(this.start, 'YYYY-MM-DD HH:mm:ss');
  }

  get endMoment() {
    return moment(this.end, 'YYYY-MM-DD HH:mm:ss');
  }

  calculate() {
    const startSecond = Math.floor(this.startMoment.toDate().getTime() / 1000);
    const endSecond = Math.floor(this.endMoment.toDate().getTime() / 1000);

    const sx = (startSecond - Math.floor(this.config.startDate.toDate().getTime() / 1000)) * this.config.secondWidth;
    const width = (endSecond - startSecond) * this.config.secondWidth;
    const ex = sx + width;
        
    const height = this.layoutConfig.BAR_HEIGHT;
    const groupIndex = this.groups.findIndex(item => item === this.group);
    const taskCenterTop = this.layoutConfig.TASK_CENTER_TOP;
    const sy = groupIndex * this.layoutConfig.ROW_HEIGHT + taskCenterTop - (height / 2);
    const ey = sy + height;

    this.sx = sx;
    this.ex = ex;
    this.width = width;
    this.sy = sy;
    this.ey = ey;
    this.height = height;
    this.st = startSecond * 1000;
    this.et = endSecond * 1000;
  }

  toJSON() {
    return {
      id: this.id,
      sx: this.sx,
      ex: this.ex,
      width: this.width,
      sy: this.sy,
      ey: this.ey,
      height: this.height,
      st: this.st,
      et: this.et,
      dragging: this.dragging,
      selected: this.selected
    };
  }
}