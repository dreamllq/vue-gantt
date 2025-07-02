import { GanttBarDragOperationConstructor, GanttBarUpdateOperationData, OperationInterface } from '@/types/gantt-operation-history';
import { GanttBars } from './gantt-bars';
import { GanttGroups } from './gantt-groups';
import { GanttGroup } from './gantt-group';
import { GanttBus } from './gantt-bus';
import { GanttBusEvents } from '@/types/gantt-bus';

export class GanttBarUpdateOperation implements OperationInterface {
  bus: GanttBus;
  bars: GanttBars;
  groups: GanttGroups;
  oldData: GanttBarUpdateOperationData;
  newData: GanttBarUpdateOperationData;

  constructor(data: GanttBarDragOperationConstructor) {
    this.bus = data.bus;
    this.bars = data.bars;
    this.groups = data.groups;
    this.oldData = data.oldData;
    this.newData = data.newData;
  }

  up () {
    const bar = this.bars.getById(this.newData.barId)!;
    const group = this.groups.getById(this.newData.groupId)!;
    let oldGroup:GanttGroup|undefined;
    if (bar.group.id !== group.id) {
      oldGroup = bar.group;
      bar.group = group;
    }
    bar.start = this.newData.start;
    bar.end = this.newData.end;
    bar.rowIndex = this.newData.rowIndex;
    bar.draggable = this.newData.draggable;
    bar.selectable = this.newData.selectable;
    bar.schedulingMode = this.newData.schedulingMode;
    bar.calculate();
    if (oldGroup) {
      this.bars.calculateGroupOverlap({ groupId: oldGroup.id });
    }

    this.bus.emit(GanttBusEvents.BAR_POS_CHANGE, [bar.id]);
  }

  down () {
    const bar = this.bars.getById(this.oldData.barId)!;
    const group = this.groups.getById(this.oldData.groupId)!;
    let oldGroup:GanttGroup|undefined;
    if (bar.group.id !== group.id) {
      oldGroup = bar.group;
      bar.group = group;
    }
    bar.start = this.oldData.start;
    bar.end = this.oldData.end;
    bar.rowIndex = this.oldData.rowIndex;
    bar.draggable = this.oldData.draggable;
    bar.selectable = this.oldData.selectable;
    bar.schedulingMode = this.oldData.schedulingMode;
    bar.calculate();
    if (oldGroup) {
      this.bars.calculateGroupOverlap({ groupId: oldGroup.id });
    }
    this.bus.emit(GanttBusEvents.BAR_POS_CHANGE, [bar.id]);
  }
}