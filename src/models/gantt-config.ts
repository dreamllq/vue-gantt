import { DateString, SplitTimeString } from '@/types/date';
import { GanttConfigClassConstructor, SchedulingMode } from '@/types/gantt-config';
import { Unit } from '@/types/unit';
import { GanttLayoutConfig } from './gantt-layout-config';
import { LinkShowStrategy } from '@/types/gantt-link';
import EventEmitter from '@/utils/eventemitter';
import { menusItemType } from '@/types/contextmenu-menus';
import { GanttJsonDataConfig } from '@/types/gantt';
import { strToDate } from '@/utils/to-date';
import { dateFormat } from '@/utils/date-format';
import { dateDiff } from '@/utils/date-diff';

export class GanttConfig extends EventEmitter {
  static Events = {
    DRAGGABLE_CHANGE: 'DRAGGABLE_CHANGE',
    SELECTABLE_CHANGE: 'SELECTABLE_CHANGE',
    DATA_SCALE_UNIT_CHANGE: 'DATA_SCALE_UNIT_CHANGE',
    MULTIPLE_SELECTABLE_CHANGE: 'MULTIPLE_SELECTABLE_CHANGE',
    SHOW_ATTACHED_BARS_CHANGE: 'SHOW_ATTACHED_BARS_CHANGE'
  };

  // #region 属性
  private _startDate: DateString;
  private _endDate: DateString;
  private _daySplitTime: SplitTimeString;
  durationUnit: Unit;
  private _dataScaleUnit: Unit;
  layoutConfig: GanttLayoutConfig;
  lazyDebounceTime: number;
  schedulingMode:SchedulingMode;
  private _draggable = false;
  private _selectable = false;
  private _multipleSelectable = false;
  multipleDraggable = false;
  contextMenuEnable = false;
  linkShowStrategy:LinkShowStrategy;
  contextMenuMenus?:menusItemType[];
  showCurrentTimeLine: boolean;
  _showAttachedBars: boolean;
  dragTimeOffset: number;
  start: string;
  end: string;
  startTimeMills: number;
  endTimeMills: number;
  // #endregion

  constructor(data:GanttConfigClassConstructor) {
    super();
    this._startDate = data.startDate;
    this._endDate = data.endDate;
    this._daySplitTime = data.daySplitTime || '00:00';
    this.durationUnit = data.durationUnit || Unit.SECOND;
    this._dataScaleUnit = data.dataScaleUnit || Unit.DAY;
    this.layoutConfig = data.layoutConfig;
    this.lazyDebounceTime = data.lazyDebounceTime || 0;
    this.schedulingMode = data.schedulingMode || SchedulingMode.FORWARD;
    this._draggable = !!data.draggable;
    this._selectable = !!data.selectable;
    this._multipleSelectable = !!data.multipleSelectable;
    this.multipleDraggable = !!data.multipleDraggable;
    this.contextMenuEnable = !!data.contextMenuEnable;
    this.contextMenuMenus = data.contextMenuMenus;
    this.linkShowStrategy = data.linkShowStrategy || LinkShowStrategy.NONE;
    this.showCurrentTimeLine = !!data.showCurrentTimeLine; 
    this._showAttachedBars = !!data.showAttachedBars;
    this.dragTimeOffset = data.dragTimeOffset || 5 * 60;

    
    this.start = `${dateFormat(strToDate(this._startDate))} ${this.daySplitTime.hour.toString().padStart(2, '0')}:${this.daySplitTime.minute.toString().padStart(2, '0')}:00`;
    this.end = `${dateFormat(strToDate(this._endDate))} ${this.daySplitTime.hour.toString().padStart(2, '0')}:${this.daySplitTime.minute.toString().padStart(2, '0')}:00`;
    this.startTimeMills = strToDate(this.start).getTime();
    this.endTimeMills = strToDate(this.end).getTime();
  }

  get showAttachedBars() {
    return this._showAttachedBars;
  }

  set showAttachedBars(val) {
    if (this._showAttachedBars === val) return;
    this._showAttachedBars = val;
    this.emit(GanttConfig.Events.SHOW_ATTACHED_BARS_CHANGE, val);
  }

  get dataScaleUnit() {
    return this._dataScaleUnit;
  }

  set dataScaleUnit(val: Unit) {
    if (this._dataScaleUnit === val) return;
    this._dataScaleUnit = val;
    this.emit(GanttConfig.Events.DATA_SCALE_UNIT_CHANGE, val);
  }

  get draggable() {
    return this._draggable;
  }

  set draggable(val:boolean) {
    if (this._draggable === val) return;
    this._draggable = val;
    this.emit(GanttConfig.Events.DRAGGABLE_CHANGE, val);
  }

  get selectable() {
    return this._selectable;
  }

  set selectable(val: boolean) {
    if (this._selectable === val) return;
    this._selectable = val;
    this.emit(GanttConfig.Events.SELECTABLE_CHANGE, val);
  }

  get multipleSelectable() {
    return this._multipleSelectable;
  }

  set multipleSelectable(val:boolean) {
    if (this._multipleSelectable === val) return;
    this._multipleSelectable = val;
    this.emit(GanttConfig.Events.MULTIPLE_SELECTABLE_CHANGE, val);
  }

  get daySplitTime() {
    const daySplitTime = this._daySplitTime;
    const [hour, minute] = daySplitTime.split(':');
    return {
      hour: Number(hour),
      minute: Number(minute)
    };
  }

  get totalSeconds () {
    return Math.floor((this.endTimeMills - this.startTimeMills) / 1000); 
  }

  get minuteWidth() {
    if (this.dataScaleUnit === Unit.DAY) {
      return this.layoutConfig.TIME_UNIT_WIDTH / 24 / 60; 
    } else if (this.dataScaleUnit === Unit.WEEK) {
      return this.layoutConfig.TIME_UNIT_WIDTH / 7 / 24 / 60; 
    } else if (this.dataScaleUnit === Unit.MONTH) {
      return this.layoutConfig.TIME_UNIT_WIDTH / 30 / 24 / 60;
    }
    return 0;
  } 

  get secondWidth() {
    return this.minuteWidth / 60;
  }

  get dataUnitCount() {
    return dateDiff(strToDate(this.end), strToDate(this.start), this.dataScaleUnit);
  }

  toJSON():GanttJsonDataConfig {
    return {
      startDate: this._startDate,
      endDate: this._endDate,
      contextMenuEnable: this.contextMenuEnable,
      contextMenuMenus: this.contextMenuMenus,
      dataScaleUnit: Object.keys(Unit).find(key => Unit[key] === this._dataScaleUnit) as keyof typeof Unit,
      daySplitTime: Object.keys(Unit).find(key => Unit[key] === this._dataScaleUnit) as keyof typeof Unit,
      draggable: this.draggable,
      dragTimeOffset: this.dragTimeOffset,
      durationUnit: Object.keys(Unit).find(key => Unit[key] === this.durationUnit) as keyof typeof Unit,
      lazyDebounceTime: this.lazyDebounceTime,
      linkShowStrategy: Object.keys(LinkShowStrategy).find(key => LinkShowStrategy[key] === this.linkShowStrategy) as keyof typeof LinkShowStrategy,
      multipleDraggable: this.multipleDraggable,
      multipleSelectable: this.multipleSelectable,
      schedulingMode: Object.keys(SchedulingMode).find(key => SchedulingMode[key] === this.schedulingMode) as keyof typeof SchedulingMode,
      selectable: this.selectable,
      showAttachedBars: this.showAttachedBars,
      showCurrentTimeLine: this.showAttachedBars
    };
  }
}