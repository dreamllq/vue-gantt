// import { GanttBus } from '@/models/gantt-bus';

import { GanttBars } from '@/models/gantt-bars';
import { DateTimeString } from './date';
import { BarId } from './gantt-bar';
import { GroupId } from './gantt-group';
import { GanttGroups } from '@/models/gantt-groups';
import { GanttBus } from '@/models/gantt-bus';


// export type GanttOperationHistoryClassConstructor = {
//   bus: GanttBus
// } 

export interface OperationInterface {
  up: ()=>void,
  down: ()=>void
}

export type GanttBarDragOperationData = {
  barId: BarId,
  groupId: GroupId,
  start: DateTimeString | null,
  end: DateTimeString | null,
  rowIndex: number
}

export type GanttBarDragOperationConstructor = {
  bus: GanttBus,
  bars: GanttBars,
  groups: GanttGroups,
  oldData: GanttBarDragOperationData,
  newData: GanttBarDragOperationData
}