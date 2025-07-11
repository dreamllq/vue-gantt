// import { GanttBus } from '@/models/gantt-bus';

import { GanttBars } from '@/models/gantt-bars';
import { DateTimeString } from './date';
import { BarId } from './gantt-bar';
import { GroupId } from './gantt-group';
import { GanttGroups } from '@/models/gantt-groups';
import { GanttBus } from '@/models/gantt-bus';
import { SchedulingMode } from './gantt-config';


export type GanttOperationHistoryClassConstructor = {
  bus: GanttBus
} 

export interface OperationInterface {
  up: ()=>void,
  down: ()=>void
}

export type GanttBarUpdateOperationData = {
  barId: BarId,
  groupId: GroupId,
  start: DateTimeString | null,
  end: DateTimeString | null,
  rowIndex: number,
  schedulingMode?: SchedulingMode,
  selectable:boolean,
  draggable:boolean,
}

export type GanttBarDragOperationConstructor = {
  bus: GanttBus,
  bars: GanttBars,
  groups: GanttGroups,
  oldData: GanttBarUpdateOperationData,
  newData: GanttBarUpdateOperationData
}