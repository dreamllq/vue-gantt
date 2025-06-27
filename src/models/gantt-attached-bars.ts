import { GanttAttachedBarViewClassConstructor } from '@/types/gantt-attached-bar';
import { BizArray } from './biz-array';
import { GanttAttachedBarView } from './gantt-attached-bar-view';
import { GanttBus } from './gantt-bus';
import { GanttAttachedBarsClassConstructor } from '@/types/gantt-attached-bars';
import { GanttConfig } from './gantt-config';
import { GanttLayoutConfig } from './gantt-layout-config';
import { GanttGroups } from './gantt-groups';

export class GanttAttachedBars extends BizArray<GanttAttachedBarView> {
  config: GanttConfig;
  layoutConfig: GanttLayoutConfig;
  groups: GanttGroups;
  bus: GanttBus;
  constructor(data:GanttAttachedBarsClassConstructor) {
    super();
    this.config = data.config;
    this.layoutConfig = data.layoutConfig;
    this.groups = data.groups;
    this.bus = data.bus;
  }
  add(data: GanttAttachedBarViewClassConstructor) {
    const bar = new GanttAttachedBarView(data);
    this.push(bar);
    bar.calculate();
  }

  updateShow() {
    this.forEach(bar => {
      bar.isShow = this.groups.getById(bar.group.id)!.isShow;
    });
  }

  calculate() {
    this.forEach(bar => bar.calculate());
  }
}