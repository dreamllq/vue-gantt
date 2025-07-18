import { BarId, GanttBarUpdateParams, GanttBarViewClassConstructor } from '@/types/gantt-bar';
import { GanttBar } from './gantt-bar';
import { GanttGroups } from './gantt-groups';
import { GanttBars } from './gantt-bars';
import { GanttBus } from './gantt-bus';
import { GanttBusEvents } from '@/types/gantt-bus';
import { GanttGroup } from './gantt-group';
import { cloneDeep, isBoolean, isUndefined, uniq, uniqBy } from 'lodash';
import { GanttBarUpdateOperationData } from '@/types/gantt-operation-history';
import { GanttBarUpdateOperation } from './gantt-operation';
import { GanttJsonDataBar } from '@/types/gantt';
import { SchedulingMode } from '@/types/gantt-config';

export class GanttBarView extends GanttBar {
  static Events = { SELECTED_CHANGE: 'SELECTED_CHANGE' };
  // #region 绘制属性
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
  zIndex = 1;
  color?:string;

  private _selectable?: boolean;
  private _draggable?:boolean;
  // #endregion
  constructor(data:GanttBarViewClassConstructor) {
    super(data);
    this.groups = data.groups;
    this.bars = data.bars;
    this.bus = data.bus;
    this._selectable = data.selectable;
    this._draggable = data.draggable;
    this._contextMenuEnable = data.contextMenuEnable;
    this.color = data.color;
  }

  // #region 计算属性
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
    if (this.selectable === false) return;
    if (this._selected === val) return;
    
    this._selected = val;
    if (val === true) {
      this.bars.selectedBars.push(this);
    } else {
      this.bars.selectedBars.removeById(this.id);
    }

    this.bus.emit(GanttBusEvents.BAR_CHANGE, [this.id]);
    this.bus.emit(GanttBusEvents.BAR_SELECTED_CHANGE, {
      barId: this.id,
      selected: this.selected 
    });
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
  // #endregion

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
        
    this.updateInfo(data);

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

  updateInfo(data:GanttBarUpdateParams) {
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
    this.bus.emit(GanttBusEvents.BAR_CHANGE, [this.id]);
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
    this.calculatePosX();
    this.calculatePosY();
  }

  calculatePosX() {
    if (!this.isShow) return;
    const sx = Math.floor((this.startTimeMills - this.config.startTimeMills) / 1000) * this.config.secondWidth;
    const width = Math.floor((this.endTimeMills - this.startTimeMills) / 1000) * this.config.secondWidth;
    const ex = sx + width;
    this.sx = sx;
    this.ex = ex;
    this.width = width;
  }

  calculatePosY() {
    if (!this.isShow) return;
    const height = this.layoutConfig.BAR_HEIGHT;
    const groupIndex = this.groups.getGroupIndex(this.groups.getById(this.group.id)!);
    const barCenterTop = this.layoutConfig.ROW_HEIGHT / 2;
    const _sy = this.groups.getGroupTopByIndex(groupIndex) + barCenterTop - (height / 2);
    const sy = _sy;
    const ey = sy + height;
   
    this._sy = _sy;
    this.sy = sy;
    this.ey = ey;
    this.height = height;
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

    const bars = uniqBy(this.dayList
      .reduce<GanttBar[]>((acc, day) => [...acc, ...(this.group.dayBarMap[day] || [])], []), bar => bar.id)
      .map(bar => this.bars.getById(bar.id)!);
    const overlapBars = bars.filter(bar => this.isOverlapBar(bar));
      
    overlapBars.forEach(bar => {
      bar.overlapBarIds.push(this.id);
      this.overlapBarIds.push(bar.id);
    });
  }

  isRectanglesOverlap (rect1:{x1:number, x2: number}, rect2:{x1:number, x2: number}) {
    if (rect1.x2 <= rect2.x1 || rect2.x2 <= rect1.x1) {
      return false;
    }

    // 如果上述条件都不满足，则两个矩形重叠
    return true;
  }

  isOverlapBar(bar: GanttBarView) {
    if (bar.id === this.id) return false;
    
    return this.isRectanglesOverlap({
      x1: this.startTimeMills,
      x2: this.endTimeMills
    }, {
      x1: bar.startTimeMills,
      x2: bar.endTimeMills
    });
  }

  changeY() {
    if (!this.isShow) return;
    const groupIndex = this.groups.getGroupIndex(this.groups.getById(this.group.id)!);
    const barCenterTop = this.layoutConfig.ROW_HEIGHT / 2;
    const height = this.layoutConfig.BAR_HEIGHT;
    const _sy = this.groups.getGroupTopByIndex(groupIndex) + barCenterTop - (height / 2);
    const sy = _sy + (this.rowIndex * this.layoutConfig.ROW_HEIGHT);
    const ey = sy + height;

    this._sy = _sy;
    this.sy = sy;
    this.ey = ey;
    this.height = height;
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

  toUiJSON() {
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
      rowIndex: this.rowIndex,
      zIndex: this.zIndex,
      color: this.color,
      start: this.start,
      end: this.end,
      overlapBarIds: cloneDeep(this.overlapBarIds),
      groupId: this.group.id
    };
  }

  toJSON():GanttJsonDataBar {
    return {
      id: this.id,
      start: this.start,
      end: this.end,
      duration: this.duration,
      groupId: this.group.id,
      schedulingMode: this._schedulingMode ? (Object.keys(SchedulingMode).find(key => SchedulingMode[key] === this._schedulingMode) as keyof typeof SchedulingMode) : undefined,
      color: this.color,
      contextMenuEnable: this._contextMenuEnable,
      draggable: this._draggable,
      selectable: this._selectable
    };
  }
}