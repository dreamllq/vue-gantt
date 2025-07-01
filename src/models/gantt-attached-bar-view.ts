import { AttachedBarId, GanttAttachedBarViewClassConstructor } from '@/types/gantt-attached-bar';
import { GanttAttachedBar } from './gantt-attached-bar';
import { GanttBus } from './gantt-bus';
import { GanttAttachedBars } from './gantt-attached-bars';
import { GanttGroups } from './gantt-groups';
import moment from 'moment';

export class GanttAttachedBarView extends GanttAttachedBar {
  sx = 0;
  ex = 0;
  width = 0;
  _sy = 0;
  sy = 0;
  ey = 0;
  height = 0;
  st = 0;
  et = 0;
  groups:GanttGroups;
  attachedBars: GanttAttachedBars;
  rowIndex = 0;
  bus:GanttBus;
  overlapAttachedBarIds:AttachedBarId[] = [];
  isShow = true;

  constructor(data: GanttAttachedBarViewClassConstructor) {
    super(data);
    this.groups = data.groups;
    this.attachedBars = data.attachedBars;
    this.bus = data.bus;
  }

  get startMoment() {
    return moment(this.start, 'YYYY-MM-DD HH:mm:ss');
  }
  
  get endMoment() {
    return moment(this.end, 'YYYY-MM-DD HH:mm:ss');
  }

  calculate() {
    if (!this.isShow) return;
    const startSecond = Math.floor(this.startMoment.toDate().getTime() / 1000);
    const endSecond = Math.floor(this.endMoment.toDate().getTime() / 1000);

    const sx = (startSecond - Math.floor(this.config.startDate.toDate().getTime() / 1000)) * this.config.secondWidth;
    const width = (endSecond - startSecond) * this.config.secondWidth;
    const ex = sx + width;
        
    const height = this.layoutConfig.ATTACHED_BAR_HEIGHT;
    const groupIndex = this.groups.getGroupIndex(this.groups.getById(this.group.id)!);
    const barCenterTop = this.layoutConfig.ATTACHED_ROW_HEIGHT / 2;
    const _sy = this.groups.getGroupTopByIndex(groupIndex) + barCenterTop - (height / 2);
    const sy = this.groups.getGroupTopByIndex(groupIndex) + barCenterTop - (height / 2) + (this.rowIndex * this.layoutConfig.ATTACHED_ROW_HEIGHT) + this.groups.getById(this.group.id)!.barsHeight;
    const ey = sy + height;
   
    this.sx = sx;
    this.ex = ex;
    this.width = width;
    this._sy = _sy;
    this.sy = sy;
    this.ey = ey;
    this.height = height;
    this.st = startSecond * 1000;
    this.et = endSecond * 1000;
  }

  changeY() {
    const barCenterTop = this.layoutConfig.ATTACHED_ROW_HEIGHT / 2;
    const groupIndex = this.groups.getGroupIndex(this.groups.getById(this.group.id)!);
    const height = this.layoutConfig.ATTACHED_BAR_HEIGHT;
    const _sy = this.groups.getGroupTopByIndex(groupIndex) + barCenterTop - (height / 2);
    const sy = this.groups.getGroupTopByIndex(groupIndex) + barCenterTop - (height / 2) + (this.rowIndex * this.layoutConfig.ATTACHED_ROW_HEIGHT) + this.groups.getById(this.group.id)!.barsHeight;
    const ey = sy + height;
   
    this._sy = _sy;
    this.sy = sy;
    this.ey = ey;
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
      rowIndex: this.rowIndex
    };
  }
}