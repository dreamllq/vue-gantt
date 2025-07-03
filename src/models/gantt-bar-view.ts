import { BarId, GanttBarUpdateParams, GanttBarViewClassConstructor } from '@/types/gantt-bar';
import { GanttBar } from './gantt-bar';
import { GanttGroups } from './gantt-groups';
import moment from 'moment';
import { GanttBars } from './gantt-bars';
import { isRectanglesOverlap } from '@/utils/is-rectangles-overlap';
import { GanttBus } from './gantt-bus';
import { GanttBusEvents } from '@/types/gantt-bus';
import { GanttGroup } from './gantt-group';
import { isBoolean, isUndefined } from 'lodash';
import { DateTimeString } from '@/types/date';
import { GroupId } from '@/types/gantt-group';
import { GanttBarUpdateOperationData } from '@/types/gantt-operation-history';
import { GanttBarUpdateOperation } from './gantt-operation';

export class GanttBarView extends GanttBar {
  static Events = { SELECTED_CHANGE: 'SELECTED_CHANGE' };

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
  private _selected = false;
  private _contextMenuEnable:boolean | undefined;
  groups:GanttGroups;
  bars: GanttBars;
  rowIndex = 0;
  overlapBarIds:BarId[] = [];
  isShow = true;
  bus:GanttBus;

  private _selectable?: boolean;
  private _draggable?:boolean;
  constructor(data:GanttBarViewClassConstructor) {
    super(data);
    this.groups = data.groups;
    this.bars = data.bars;
    this.bus = data.bus;
    this._selectable = data.selectable;
    this._draggable = data.draggable;
    this._contextMenuEnable = data.contextMenuEnable;
  }

  set group(val: GanttGroup) {
    const oldGroupId = this.group.id;
    const newGroupId = val.id;
    if (oldGroupId !== newGroupId) {
      super.group = val;
      if (!this.isClone) {
        this.clearOverlap();
        this.groups.getById(oldGroupId)!.bars.removeById(this.id);
        this.groups.getById(newGroupId)!.bars.push(this);
      }
    }
  }

  get group() {
    return super.group;
  }

  get selected() {
    return this._selected;
  }
  
  set selected(val) {
    if (this._selected === val) return;
    
    this._selected = val;
    if (val === true) {
      this.bars.selectedBars.push(this);
    } else {
      this.bars.selectedBars.removeById(this.id);
    }
  }

  get contextMenuEnable():boolean {
    if (isBoolean(this._contextMenuEnable)) {
      return this._contextMenuEnable && this.config.contextMenuEnable;
    } else {
      return this.config.contextMenuEnable;
    }
  }

  set contextMenuEnable(val:boolean | undefined) {
    if (this._contextMenuEnable === val) return;
    this._contextMenuEnable = val;
    this.bus.emit(GanttBusEvents.BAR_CONTEXT_MENU_ENABLE_CHANGE, [this.id]);
  }

  get startMoment() {
    return moment(this.start, 'YYYY-MM-DD HH:mm:ss');
  }

  get endMoment() {
    return moment(this.end, 'YYYY-MM-DD HH:mm:ss');
  }

  get selectable(): boolean {
    return this.config.selectable && (isBoolean(this._selectable) ? this._selectable : true);
  }

  set selectable(val:boolean | undefined) {
    if (this._selectable === val) return;
    this._selectable = val;
  }

  get draggable():boolean {
    return this.config.draggable && (isBoolean(this._draggable) ? this._draggable : true);
  }

  set draggable(val:boolean | undefined) {
    this._draggable = val;
  }

  update(data:GanttBarUpdateParams) {
    const operationOldData:GanttBarUpdateOperationData = {
      barId: this.id,
      groupId: this.group.id,
      start: this.start,
      end: this.end,
      rowIndex: this.rowIndex,
      draggable: this.draggable,
      schedulingMode: this.schedulingMode,
      selectable: this.selectable
    };
        
    if (data.schedulingMode) {
      this.schedulingMode = data.schedulingMode;
    }

    if (!isUndefined(data.duration)) {
      this.duration = data.duration;
    }

    if (!isUndefined(data.draggable)) {
      this.draggable = data.draggable;
    }

    if (!isUndefined(data.selectable)) {
      this.selectable = data.selectable;
    }

    if (!isUndefined(data.rowIndex)) {
      this.rowIndex = data.rowIndex;
    }
    
    if (!isUndefined(data.start)) {
      this.start = data.start;
    }

    if (!isUndefined(data.end)) {
      this.end = data.end;
    }

    let oldGroup:GanttGroup|undefined;
    if (data.groupId && this.group.id !== data.groupId) {
      oldGroup = this.group;
      this.group = this.groups.getById(data.groupId)!;
    }

    this.calculate();
    
    if (oldGroup) {
      this.bars.calculateGroupOverlap({ groupId: oldGroup.id });
    }
    this.bus.emit(GanttBusEvents.BAR_POS_CHANGE, [this.id]);

    const operationNewData:GanttBarUpdateOperationData = {
      barId: this.id,
      groupId: this.group.id,
      start: this.start,
      end: this.end,
      rowIndex: this.rowIndex,
      draggable: this.draggable,
      schedulingMode: this.schedulingMode,
      selectable: this.selectable
    };
    
    const operation = new GanttBarUpdateOperation({
      bus: this.bus,
      bars: this.bars,
      groups: this.groups,
      newData: operationNewData,
      oldData: operationOldData
    });
    this.bus.emit(GanttBusEvents.HISTORY_PUSH, operation);
  }

  calculate() {
    if (this.isClone) return;
    if (!this.isShow) return;
    this.resetTimeRange();
    this.calculatePos();
    this.clearOverlap();
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

  clearOverlap() {
    if (this.isClone) return;
    this.overlapBarIds.forEach(id => {
      this.bars.getById(id)!.overlapBarIds = this.bars.getById(id)!.overlapBarIds.filter(oid => oid !== this.id);
    });
    this.overlapBarIds = [];
  }
  calculateOverlap() {
    if (this.isClone) return;
    const group = this.groups.getById(this.group.id)!;
    if (!group.barOverlap) {
      this.calculateOverlapBarIds();
      this.bus.emit(GanttBusEvents.GROUP_OVERLAP_CHANGE, {
        barId: this.id,
        groupId: group.id
      });
    }
  }
  calculateOverlapBarIds() {
    if (this.isClone) return;
    // const groupBars = this.bars.filter(item => item.group.id === this.group.id);
    const groupBars = this.groups.getById(this.group.id)!.bars;
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