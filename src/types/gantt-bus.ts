import { BarId } from './gantt-bar';
import { GroupId } from './gantt-group';
import { Id } from './id';
export enum GanttBusEvents {
  GROUP_ROWS_CHANGE='GROUP_ROWS_CHANGE',
  BAR_POS_CHANGE='BAR_POS_CHANGE',
  GROUP_OVERLAP_CHANGE = 'GROUP_OVERLAP_CHANGE'
}

export interface GanttBusEventsInterface {
  [GanttBusEvents.GROUP_ROWS_CHANGE]: (data: {
    groupId: GroupId,
    effectGroupIds: GroupId[],
    effectBarIds: BarId[]
  })=> void,
  [GanttBusEvents.BAR_POS_CHANGE]:(barIds:BarId[])=>void,
  [GanttBusEvents.GROUP_OVERLAP_CHANGE]:(data:{
    groupId: GroupId,
    barId: BarId
  })=>void
}
