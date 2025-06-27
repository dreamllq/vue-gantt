import { DateString, SplitTimeString } from '@/types/date';
import { GanttConfigClassConstructor, SchedulingMode } from '@/types/gantt-config';
import { Unit } from '@/types/unit';
import { GanttLayoutConfig } from './gantt-layout-config';
import moment from 'moment';
import { LinkShowStrategy } from '@/types/gantt-link';
import EventEmitter from '@/utils/eventemitter';
import { menusItemType } from '@/types/contextmenu-menus';

export class GanttConfig extends EventEmitter {
  static EVENTS = {
    DRAGGABLE_CHANGE: 'DRAGGABLE_CHANGE',
    SELECTABLE_CHANGE: 'SELECTABLE_CHANGE',
    CHECKABLE_CHANGE: 'CHECKABLE_CHANGE'
  };

  private _startDate: DateString;
  private _endDate: DateString;
  private _daySplitTime: SplitTimeString;
  durationUnit: Unit;
  dataScaleUnit: Unit;
  layoutConfig: GanttLayoutConfig;
  lazyDebounceTime: number;
  schedulingMode:SchedulingMode;
  private _draggable = false;
  private _selectable = false;
  private _checkable = false;
  multipleDraggable = false;
  contextMenuEnable = false;
  linkShowStrategy:LinkShowStrategy;
  contextMenuMenus?:menusItemType[];
  showCurrentTimeLine: boolean;
  showAttachedBar: boolean;

  constructor(data:GanttConfigClassConstructor) {
    super();
    this._startDate = data.startDate;
    this._endDate = data.endDate;
    this._daySplitTime = data.daySplitTime || '00:00';
    this.durationUnit = Unit.SECOND;
    this.dataScaleUnit = Unit.DAY;
    this.layoutConfig = data.layoutConfig;
    this.lazyDebounceTime = data.lazyDebounceTime || 50;
    this.schedulingMode = data.schedulingMode || SchedulingMode.FORWARD;
    this._draggable = !!data.draggable;
    this._selectable = !!data.selectable;
    this._checkable = !!data.checkable;
    this.multipleDraggable = !!data.multipleDraggable;
    this.contextMenuEnable = !!data.contextMenuEnable;
    this.contextMenuMenus = data.contextMenuMenus;
    this.linkShowStrategy = data.linkShowStrategy || LinkShowStrategy.NONE;
    this.showCurrentTimeLine = !!data.showCurrentTimeLine; 
    this.showAttachedBar = !!data.showAttachedBar;
  }

  get draggable() {
    return this._draggable;
  }

  set draggable(val:boolean) {
    if (this._draggable === val) return;
    this._draggable = val;
    this.emit(GanttConfig.EVENTS.DRAGGABLE_CHANGE, val);
  }

  get selectable() {
    return this._selectable;
  }

  set selectable(val: boolean) {
    if (this._selectable === val) return;
    this._selectable = val;
    this.emit(GanttConfig.EVENTS.SELECTABLE_CHANGE, val);
  }

  get checkable() {
    return this._checkable;
  }

  set checkable(val:boolean) {
    if (this._checkable === val) return;
    this._checkable = val;
    this.emit(GanttConfig.EVENTS.CHECKABLE_CHANGE, val);
  }

  get daySplitTime() {
    const daySplitTime = this._daySplitTime;
    const [hour, minute] = daySplitTime.split(':');
    return {
      hour: Number(hour),
      minute: Number(minute)
    };
  }

  get startDate() {
    return moment(this._startDate, 'YYYY-MM-DD').startOf(this.dataScaleUnit).add(this.daySplitTime.hour, 'hours').add(this.daySplitTime.minute, 'minutes');
  }

  get endDate() {
    return moment(this._endDate, 'YYYY-MM-DD').endOf(this.dataScaleUnit).add(1, 'day').startOf('day').add(this.daySplitTime.hour, 'hours').add(this.daySplitTime.minute, 'minutes');
  }

  get totalSeconds () {
    return this.endDate.diff(this.startDate, 'second'); 
  }

  get minuteWidth() {
    if (this.dataScaleUnit === Unit.DAY) {
      return this.layoutConfig.TIME_UNIT_WIDTH / 24 / 60; 
    } else if (this.dataScaleUnit === Unit.WEEK) {
      return this.layoutConfig.TIME_UNIT_WIDTH / 7 / 24 / 60; 
    } else if (this.dataScaleUnit === Unit.MINUTE) {
      return this.layoutConfig.TIME_UNIT_WIDTH / 30 / 24 / 60;
    }
    return 0;
  } 

  get secondWidth() {
    return this.minuteWidth / 60;
  }

  get dataUnitCount() {
    return this.endDate.diff(this.startDate, this.dataScaleUnit);
  }
}