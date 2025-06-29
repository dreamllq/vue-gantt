import { DateTimeString } from '@/types/date';
import { GanttGroup } from './gantt-group';
import TimeRange from '@/utils/time-range/index.ts';
import { BarId, GanttBarClassConstructor } from '@/types/gantt-bar';
import { GanttBase } from './gantt-base';
import { SchedulingMode } from '@/types/gantt-config';
import { cloneDeep } from 'lodash';
import moment from 'moment';

export class GanttBar extends GanttBase {
  id: BarId;
  start: DateTimeString | null = null;
  end: DateTimeString | null = null;
  duration: number | null = null;
  private _group: GanttGroup;
  schedulingMode:SchedulingMode | null = null;

  constructor(data:GanttBarClassConstructor) {
    super(data);
    this.id = data.id;
    this._group = data.group;
    this.schedulingMode = data.schedulingMode || null;
    this.duration = data.duration;

    this.resetTimeRange({
      start: data.start,
      end: data.end
    }, false);
  }

  get group() {
    return this._group;
  }

  set group(group: GanttGroup) {
    this._group = group;
  }

  get mergeSchedulingMode() {
    if (this.schedulingMode) return this.schedulingMode;
    else return this.config.schedulingMode;
  }
  resetTimeRange(_data:{
    start: DateTimeString | null;
    end: DateTimeString | null;
  }, resetTimeByMode = true) {
    const data = cloneDeep(_data);

    if (resetTimeByMode) {
      if (this.mergeSchedulingMode === SchedulingMode.FORWARD) {
        data.end = null;
        if (moment(data.start, 'YYYY-MM-DD HH:mm:ss').isBefore(this.config.startDate)) {
          data.start = this.config.startDate.format('YYYY-MM-DD HH:mm:ss');
        }
      } else if (this.mergeSchedulingMode === SchedulingMode.BACKWARD) {
        data.start = null;
        if (moment(data.end, 'YYYY-MM-DD HH:mm:ss').isAfter(this.config.endDate)) {
          data.end = this.config.endDate.format('YYYY-MM-DD HH:mm:ss');
        }
      }
    }
    
    if (data.start !== null && this.duration !== null && data.end === null) {
      // 开始时间存在，计算结束时间 正排
      const timeRangeEntity = new TimeRange({
        startDate: data.start,
        duration: this.duration,
        step: 1,
        unit: this.config.durationUnit,
        workTimes: this.group.workTimes
      });
      const timeRange = timeRangeEntity.calculateTimeRange();

      if (!timeRange.end.isAfter(this.config.endDate)) {
        this.start = data.start;
        this.end = timeRange.end.format('YYYY-MM-DD HH:mm:ss');
      } else {
        const timeRangeEntity = new TimeRange({
          endDate: this.config.endDate.format('YYYY-MM-DD HH:mm:ss'),
          duration: this.duration,
          step: 1,
          unit: this.config.durationUnit,
          workTimes: this.group.workTimes
        });
        const timeRange = timeRangeEntity.calculateTimeRange();
        this.start = timeRange.start.format('YYYY-MM-DD HH:mm:ss');
        this.end = this.config.endDate.format('YYYY-MM-DD HH:mm:ss');
      }
    } else if (data.end !== null && this.duration !== null && data.start === null) {
      // 结束时间存在，计算开始时间 倒排
      const timeRangeEntity = new TimeRange({
        endDate: data.end,
        duration: this.duration,
        step: 1,
        unit: this.config.durationUnit,
        workTimes: this.group.workTimes
      });
      const timeRange = timeRangeEntity.calculateTimeRange();

      if (!timeRange.start.isBefore(this.config.startDate)) {
        this.start = timeRange.start.format('YYYY-MM-DD HH:mm:ss');
        this.end = data.end;
      } else {
        const timeRangeEntity = new TimeRange({
          startDate: this.config.startDate.format('YYYY-MM-DD HH:mm:ss'),
          duration: this.duration,
          step: 1,
          unit: this.config.durationUnit,
          workTimes: this.group.workTimes
        });
        const timeRange = timeRangeEntity.calculateTimeRange();
        this.start = this.config.startDate.format('YYYY-MM-DD HH:mm:ss');
        this.end = timeRange.end.format('YYYY-MM-DD HH:mm:ss');
      }
    } else if (data.end === null || data.start === null) {
      console.error(`bar ${this.id} 时间异常：{start: ${this.start}, end: ${this.end}}`);
      this.start = data.start || data.end;
      this.end = data.start || data.end;
    } else {
      this.start = data.start;
      this.end = data.end;
    }
  }
}