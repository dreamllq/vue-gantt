import { DateTimeString } from '@/types/date';
import { GanttGroup } from './gantt-group';
import TimeRange from '@/utils/time-range/index.ts';
import { BarId, GanttBarClassConstructor } from '@/types/gantt-bar';
import { GanttBase } from './gantt-base';
import { SchedulingMode } from '@/types/gantt-config';
import { GanttGroups } from './gantt-groups';
import { getDatesBetween } from '@/utils/get-dates-between';
import { BizArray } from './biz-array';
import { strToDate } from '@/utils/to-date';
import { dateTimeFormat } from '@/utils/date-time-format';

export class GanttBar extends GanttBase {
  id: BarId;
  start: DateTimeString | null = null;
  end: DateTimeString | null = null;
  duration: number;
  private _group: GanttGroup;
  protected _schedulingMode?:SchedulingMode;
  private _hasCalculated = false;
  groups: GanttGroups;
  dayList: string[] = [];
  startTimeMills = 0;
  endTimeMills = 0;

  constructor(data:GanttBarClassConstructor) {
    super(data);
    this.id = data.id;
    this._group = data.group;
    this._schedulingMode = data.schedulingMode || undefined;
    this.duration = data.duration;
    this.start = data.start;
    this.end = data.end;
    this.groups = data.groups;
  }

  get group() {
    return this._group;
  }

  set group(group: GanttGroup) {
    if (group.id === this._group.id) return;
    this.dayList.forEach(day => {
      this.group.dayBarMap[day]!.removeById(this.id);
    });
    this._group = group;
    this.dayList.forEach(day => {
      if (!this.group.dayBarMap[day]) {
        this.group.dayBarMap[day] = new BizArray<GanttBar>();
      }

      this.group.dayBarMap[day]!.push(this);
    });
  }

  get schedulingMode():SchedulingMode {
    if (this._schedulingMode) return this._schedulingMode;
    else return this.config.schedulingMode;
  }

  set schedulingMode(val:SchedulingMode | undefined) {
    this._schedulingMode = val;
  }

  resetTimeRange() {
    this.calculateTimeRange();
    this.calculateDayList();
  }

  calculateTimeRange() {
    const data = {
      start: this.start,
      end: this.end
    };
    const resetTimeByMode = this._hasCalculated;
    this._hasCalculated = true;

    if (resetTimeByMode) {
      if (this.schedulingMode === SchedulingMode.FORWARD) {
        data.end = null;
        if (strToDate(data.start!).getTime() < strToDate(this.config.start).getTime()) {
          data.start = this.config.start;
        }
      } else if (this.schedulingMode === SchedulingMode.BACKWARD) {
        data.start = null;
        if (strToDate(data.end!).getTime() > strToDate(this.config.end).getTime()) {
          data.end = this.config.end;
        }
      }
    }

    if (data.start && data.end) {
      this.start = data.start;
      this.end = data.end;
    } else if (data.start !== null && this.duration !== null && data.end === null) {
      this.calculateTimeRangeForward({ start: data.start });
    } else if (data.end !== null && this.duration !== null && data.start === null) {
      this.calculateTimeRangeBackward({ end: data.end });
    } else {
      //  (data.end === null || data.start === null)
      console.error(`bar ${this.id} 时间异常：{start: ${this.start}, end: ${this.end}}`);
      this.start = data.start || data.end;
      this.end = data.start || data.end;
    }
    this.startTimeMills = strToDate(this.start!).getTime();
    this.endTimeMills = strToDate(this.end!).getTime();
  }

  calculateTimeRangeForward(data:{start: string}) {
    // 开始时间存在，计算结束时间 正排
    const timeRangeEntity = new TimeRange({
      startDate: data.start,
      duration: this.duration,
      step: 1,
      unit: this.config.durationUnit,
      workTimes: this.group.workTimes
    });
    const timeRange = timeRangeEntity.calculateTimeRange();

    if (!(timeRange.end.getTime() > strToDate(this.config.end).getTime())) {
      this.start = dateTimeFormat(timeRange.start);
      this.end = dateTimeFormat(timeRange.end);
    } else {
      const timeRangeEntity = new TimeRange({
        endDate: this.config.end,
        duration: this.duration,
        step: 1,
        unit: this.config.durationUnit,
        workTimes: this.group.workTimes
      });
      const timeRange = timeRangeEntity.calculateTimeRange();
      this.start = dateTimeFormat(timeRange.start);
      this.end = this.config.end;
    }
  }

  calculateTimeRangeBackward(data: {end: string}) {
    // 结束时间存在，计算开始时间 倒排
    const timeRangeEntity = new TimeRange({
      endDate: data.end,
      duration: this.duration,
      step: 1,
      unit: this.config.durationUnit,
      workTimes: this.group.workTimes
    });
    const timeRange = timeRangeEntity.calculateTimeRange();

      
    if (!(timeRange.start.getTime() < strToDate(this.config.start).getTime())) {
      this.start = dateTimeFormat(timeRange.start);
      this.end = dateTimeFormat(timeRange.end);
    } else {
      const timeRangeEntity = new TimeRange({
        startDate: this.config.start,
        duration: this.duration,
        step: 1,
        unit: this.config.durationUnit,
        workTimes: this.group.workTimes
      });
      const timeRange = timeRangeEntity.calculateTimeRange();
      this.start = this.config.start;
      this.end = dateTimeFormat(timeRange.end);
    }
  }

  calculateDayList():void {
    if (this.isClone) return;
    this.dayList.forEach(day => {
      this.group.dayBarMap[day]!.removeById(this.id);
    });
    this.dayList = getDatesBetween(this.start!, this.end!); 
    this.dayList.forEach(day => {
      if (!this.group.dayBarMap[day]) {
        this.group.dayBarMap[day] = new BizArray<GanttBar>();
      }

      this.group.dayBarMap[day]!.push(this);
    });
  }
}