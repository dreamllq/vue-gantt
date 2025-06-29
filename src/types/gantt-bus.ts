import { BarId } from './gantt-bar';
import { GroupId } from './gantt-group';
import { Id } from './id';
export enum GanttBusEvents {
  GROUP_BAR_ROWS_CHANGE='GROUP_BAR_ROWS_CHANGE',
  GROUP_HEIGHT_CHANGE='GROUP_HEIGHT_CHANGE',
  GROUP_TOP_CHANGE='GROUP_TOP_CHANGE',
  BAR_POS_CHANGE='BAR_POS_CHANGE',
  BAR_GROUP_CHANGE='BAR_GROUP_CHANGE',
  GROUP_OVERLAP_CHANGE = 'GROUP_OVERLAP_CHANGE',
  ATTACHED_BAR_POS_CHANGE='ATTACHED_BAR_POS_CHANGE'
}

export interface GanttBusEventsInterface {
  [GanttBusEvents.GROUP_BAR_ROWS_CHANGE]: (data: {
    groupId: GroupId,
    // effectGroupIds: GroupId[],
    // effectBarIds: BarId[]
  })=> void,
  [GanttBusEvents.GROUP_HEIGHT_CHANGE]: (data: {
    groupId: GroupId,
  })=> void,
  [GanttBusEvents.BAR_GROUP_CHANGE]:(data:{
    groupId: GroupId,
    barId: BarId
  })=>void,
  [GanttBusEvents.GROUP_TOP_CHANGE]: (groupIds: GroupId[])=> void,
  [GanttBusEvents.BAR_POS_CHANGE]:(barIds:BarId[])=>void,
  [GanttBusEvents.GROUP_OVERLAP_CHANGE]:(data:{
    groupId: GroupId,
    barId: BarId
  })=>void,
  [GanttBusEvents.ATTACHED_BAR_POS_CHANGE]:(barIds:BarId[])=>void,
}
