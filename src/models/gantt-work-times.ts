import { GanttWorkViewTimeConstructor, WorkTimeId } from '@/types/gantt-work-time';
import { BizArray } from './biz-array';
import { GanttWorkTimeView } from './gantt-work-time-view';
import { GanttConfig } from './gantt-config';
import { GanttGroups } from './gantt-groups';
import { GanttWorkTimesClassConstructor } from '@/types/gantt-work-times';
import { GanttBusEvents } from '@/types/gantt-bus';
import { GanttBus } from './gantt-bus';

export class GanttWorkTimes extends BizArray<GanttWorkTimeView> {
  config: GanttConfig;
  groups: GanttGroups;
  bus: GanttBus;

  constructor(data:GanttWorkTimesClassConstructor) {
    super();
    this.config = data.config;
    this.groups = data.groups;
    this.bus = data.bus;

    this.bus.on(GanttBusEvents.GROUP_BARS_HEIGHT_CHANGE, (data) => {
      const group = this.groups.getById(data.groupId)!;
      if (group.workTimes.length > 0) {
        this.bus.emit(GanttBusEvents.WORK_TIME_CHANGE, group.workTimes.getIds());
      }
    });
        
    this.bus.on(GanttBusEvents.GROUP_TOP_CHANGE, (groupIds) => {
      const workTimeIds = groupIds.reduce<WorkTimeId[]>((acc, groupId) => {
        const group = this.groups.getById(groupId)!;
        return [...acc, ...group.workTimes.getIds()];
      }, []);
      this.bus.emit(GanttBusEvents.WORK_TIME_CHANGE, workTimeIds);
    });
  }
 
  add(data:GanttWorkViewTimeConstructor) {
    const wtv = new GanttWorkTimeView(data);
    this.push(wtv);
    this.groups.getById(wtv.group.id)!.workTimes.push(wtv);
  }

  calculate() {
    this.forEach(item => item.calculate());
  }

  updateShow() {
    this.forEach(bar => {
      bar.isShow = this.groups.getById(bar.group.id)!.isShow;
    });
  }
}