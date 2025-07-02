import { BarId } from './gantt-bar';
import { GroupId } from './gantt-group';
import { OperationInterface } from './gantt-operation-history';

export enum GanttBusEvents {
  HISTORY_PUSH='HISTORY_PUSH',
  GROUP_HEIGHT_CHANGE='GROUP_HEIGHT_CHANGE',
  GROUP_TOP_CHANGE='GROUP_TOP_CHANGE',
  GROUP_BARS_HEIGHT_CHANGE='GROUP_BARS_HEIGHT_CHANGE',
  GROUP_ATTACHED_BARS_HEIGHT_CHANGE='GROUP_ATTACHED_BARS_HEIGHT_CHANGE',
  BAR_POS_CHANGE='BAR_POS_CHANGE',
  BAR_GROUP_CHANGE='BAR_GROUP_CHANGE',
  GROUP_OVERLAP_CHANGE = 'GROUP_OVERLAP_CHANGE',
  ATTACHED_BAR_POS_CHANGE='ATTACHED_BAR_POS_CHANGE'
}

export interface GanttBusEventsInterface {
  [GanttBusEvents.HISTORY_PUSH]:(operation: OperationInterface)=>void,
  [GanttBusEvents.GROUP_HEIGHT_CHANGE]: (data: {groupId: GroupId})=> void,
  [GanttBusEvents.GROUP_BARS_HEIGHT_CHANGE]: (data: {groupId: GroupId})=> void,
  [GanttBusEvents.GROUP_ATTACHED_BARS_HEIGHT_CHANGE]: (data: {groupId: GroupId})=> void,
  [GanttBusEvents.BAR_GROUP_CHANGE]:(data:{
    groupId: GroupId,
    barId: BarId
  })=>void,
  [GanttBusEvents.GROUP_TOP_CHANGE]: (groupIds: GroupId[])=> void,
  [GanttBusEvents.BAR_POS_CHANGE]:(barIds:BarId[])=>void,
  [GanttBusEvents.GROUP_OVERLAP_CHANGE]:(data:{
    groupId: GroupId,
    barId?: BarId
  })=>void,
  [GanttBusEvents.ATTACHED_BAR_POS_CHANGE]:(barIds:BarId[])=>void,
}
