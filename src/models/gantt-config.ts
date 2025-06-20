import { DateString, SplitTimeString } from '@/types/date';
import { GanttConfigClassConstructor, SchedulingMode } from '@/types/gantt-config';
import { Unit } from '@/types/unit';
import { GanttLayoutConfig } from './gantt-layout-config';
import moment from 'moment';
import { LinkShowStrategy } from '@/types/gantt-link';

export class GanttConfig {
  _startDate: DateString;
  _endDate: DateString;
  _daySplitTime: SplitTimeString;
  durationUnit: Unit;
  dataScaleUnit: Unit;
  layoutConfig: GanttLayoutConfig;
  lazyDebounceTime: number;
  schedulingMode:SchedulingMode;
  draggable = false;
  selectable = false;
  checkable = false;
  multipleDraggable = false;
  linkShowStrategy:LinkShowStrategy;

  constructor(data:GanttConfigClassConstructor) {
    this._startDate = data.startDate;
    this._endDate = data.endDate;
    this._daySplitTime = data.daySplitTime || '00:00';
    this.durationUnit = Unit.SECOND;
    this.dataScaleUnit = Unit.DAY;
    this.layoutConfig = data.layoutConfig;
    this.lazyDebounceTime = data.lazyDebounceTime || 50;
    this.schedulingMode = data.schedulingMode || SchedulingMode.FORWARD;
    this.draggable = !!data.draggable;
    this.selectable = !!data.selectable;
    this.checkable = !!data.checkable;
    this.multipleDraggable = !!data.multipleDraggable;
    this.linkShowStrategy = data.linkShowStrategy || LinkShowStrategy.NONE;
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