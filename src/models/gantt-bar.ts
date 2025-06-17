import { DateTimeString } from '@/types/date';
import { Id } from '@/types/id';
import { GanttGroup } from './gantt-group';
import TimeRange from '@/utils/time-range/index.ts';
import { GanttBarClassConstructor } from '@/types/gantt-bar';
import { GanttBase } from './gantt-base';

export class GanttBar extends GanttBase {
  id: Id;
  start: DateTimeString | null = null;
  end: DateTimeString | null = null;
  duration: number | null = null;
  group: GanttGroup;

  constructor(data:GanttBarClassConstructor) {
    super(data);
    this.id = data.id;
    this.group = data.group;
    this.resetTimeRange({
      start: data.start,
      end: data.end,
      duration: data.duration
    });
  }
  resetTimeRange(data:{
    start: DateTimeString | null;
    end: DateTimeString | null;
    duration: number | null;
  }) {
    if (data.start !== null && data.duration !== null && data.end === null) {
      // 开始时间存在，计算结束时间
      const timeRangeEntity = new TimeRange({
        startDate: data.start,
        duration: data.duration,
        step: 1,
        unit: this.config.durationUnit,
        workTimes: this.group.workTimes
      });
      const timeRange = timeRangeEntity.calculateTimeRange();
      this.start = data.start;
      this.end = timeRange.end.format('YYYY-MM-DD HH:mm:ss');
    } else if (data.end !== null && data.duration !== null && data.start === null) {
      // 结束时间存在，计算开始时间
      const timeRangeEntity = new TimeRange({
        endDate: data.end,
        duration: data.duration,
        step: 1,
        unit: this.config.durationUnit,
        workTimes: this.group.workTimes
      });
      
      const timeRange = timeRangeEntity.calculateTimeRange();
      this.start = timeRange.start.format('YYYY-MM-DD HH:mm:ss');
      this.end = data.end;
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