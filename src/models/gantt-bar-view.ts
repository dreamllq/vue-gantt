import { BarId, GanttBarViewClassConstructor } from '@/types/gantt-bar';
import { GanttBar } from './gantt-bar';
import { GanttGroups } from './gantt-groups';
import { computeTimeSecond } from '@/utils/compute-time-second';
import moment from 'moment';
import { GanttBars } from './gantt-bars';
import { isRectanglesOverlap } from '@/utils/is-rectangles-overlap';
import { max } from 'lodash';
import { GanttBus } from './gantt-bus';
import { GanttBusEvents } from '@/types/gantt-bus';
import { GanttGroup } from './gantt-group';

export class GanttBarView extends GanttBar {
  sx = 0;
  ex = 0;
  width = 0;
  _sy = 0;
  sy = 0;
  ey = 0;
  height = 0;
  st = 0;
  et = 0;
  dragging = false;
  selected = false;
  groups:GanttGroups;
  bars: GanttBars;
  rowIndex = 0;
  overlapBarIds:BarId[] = [];
  isShow = true;
  bus:GanttBus;
  
  constructor(data:GanttBarViewClassConstructor) {
    super(data);
    this.groups = data.groups;
    this.bars = data.bars;
    this.bus = data.bus;
  }

  set group(val: GanttGroup) {
    const oldGroupId = this.group.id;
    const newGroupId = val.id;
    if (oldGroupId !== newGroupId) {
      super.group = val;
      if (!this.isClone) {
        this.groups.getById(oldGroupId)!.bars.removeById(this.id);
        this.groups.getById(newGroupId)!.bars.push(this);
      }
    }
  }

  get group() {
    return super.group;
  }

  get startMoment() {
    return moment(this.start, 'YYYY-MM-DD HH:mm:ss');
  }

  get endMoment() {
    return moment(this.end, 'YYYY-MM-DD HH:mm:ss');
  }

  calculate() {
    if (this.isClone) return;
    if (!this.isShow) return;
    this.calculatePos();
    this.calculateOverlap();
  }

  calculatePos() {
    const startSecond = Math.floor(this.startMoment.toDate().getTime() / 1000);
    const endSecond = Math.floor(this.endMoment.toDate().getTime() / 1000);

    const sx = (startSecond - Math.floor(this.config.startDate.toDate().getTime() / 1000)) * this.config.secondWidth;
    const width = (endSecond - startSecond) * this.config.secondWidth;
    const ex = sx + width;
        
    const height = this.layoutConfig.BAR_HEIGHT;
    const groupIndex = this.groups.getGroupIndex(this.groups.getById(this.group.id)!);
    const barCenterTop = this.layoutConfig.ROW_HEIGHT / 2;
    const _sy = this.groups.getGroupTopByIndex(groupIndex) + barCenterTop - (height / 2);
    const sy = this.groups.getGroupTopByIndex(groupIndex) + barCenterTop - (height / 2);
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

  calculateOverlap() {
    if (this.isClone) return;
    const group = this.groups.getById(this.group.id)!;
    this.overlapBarIds.forEach(id => {
      this.bars.getById(id)!.overlapBarIds = this.bars.getById(id)!.overlapBarIds.filter(oid => oid !== this.id);
    });
    this.overlapBarIds = [];
    this.calculateOverlapBarIds();
    if (!group.barOverlap) {
      this.bus.emit(GanttBusEvents.GROUP_OVERLAP_CHANGE, {
        barId: this.id,
        groupId: group.id
      });
    }
  }
  calculateOverlapBarIds() {
    if (this.isClone) return;
    const groupBars = this.bars.filter(item => item.group.id === this.group.id);
    const overlapBars = groupBars.filter(bar => bar.id === this.id ? false : isRectanglesOverlap({
      x1: this.sx,
      y1: this._sy,
      x2: this.ex,
      y2: this.ey
    }, {
      x1: bar.sx,
      y1: bar._sy,
      x2: bar.ex,
      y2: bar.ey
    }));
      
    overlapBars.forEach(bar => {
      bar.overlapBarIds.push(this.id);
      this.overlapBarIds.push(bar.id);
    });
  }

  changeY() {
    if (this.isClone) return;
    const groupIndex = this.groups.getGroupIndex(this.groups.getById(this.group.id)!);
    const barCenterTop = this.layoutConfig.ROW_HEIGHT / 2;
    const height = this.layoutConfig.BAR_HEIGHT;
    const _sy = this.groups.getGroupTopByIndex(groupIndex) + barCenterTop - (height / 2);
    const sy = this.groups.getGroupTopByIndex(groupIndex) + barCenterTop - (height / 2) + (this.rowIndex * this.layoutConfig.ROW_HEIGHT);
    const ey = sy + height;

    this._sy = _sy;
    this.sy = sy;
    this.ey = ey;
  }

  clone() {
    return new GanttBarView({
      config: this.config,
      duration: this.duration,
      end: this.end,
      group: this.group,
      id: this.id,
      layoutConfig: this.layoutConfig,
      start: this.start,
      schedulingMode: this.schedulingMode,
      bars: this.bars,
      bus: this.bus,
      groups: this.groups,
      isClone: true
    });
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
      selected: this.selected,
      rowIndex: this.rowIndex
    };
  }
}