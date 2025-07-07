import { AttachedBarId } from './gantt-attached-bar';
import { BarId } from './gantt-bar';
import { GroupId } from './gantt-group';
import { LinkId } from './gantt-link';
import { OperationInterface } from './gantt-operation-history';
import { WorkTimeId } from './gantt-work-time';

export enum GanttBusEvents {
  HISTORY_PUSH='HISTORY_PUSH',
  GROUP_HEIGHT_CHANGE='GROUP_HEIGHT_CHANGE',
  GROUP_TOP_CHANGE='GROUP_TOP_CHANGE',
  GROUP_BARS_HEIGHT_CHANGE='GROUP_BARS_HEIGHT_CHANGE',
  GROUP_ATTACHED_BARS_HEIGHT_CHANGE='GROUP_ATTACHED_BARS_HEIGHT_CHANGE',
  GROUP_OVERLAP_CHANGE = 'GROUP_OVERLAP_CHANGE',
  BARS_CHANGE='BARS_CHANGE',
  ATTACHED_BAR_CHANGE='ATTACHED_BAR_CHANGE',
  LINK_CHANGE='LINK_CHANGE',
  LINKS_CHANGE='LINKS_CHANGE',
  BAR_CONTEXT_MENU_ENABLE_CHANGE= 'CONTEXT_MENU_ENABLE_CHANGE',
  BAR_REMOVE='BAR_REMOVE',
  BAR_CHANGE='BAR_CHANGE',
  BAR_SELECTED_CHANGE='BAR_SELECTED_CHANGE',
  WORK_TIME_CHANGE='WORK_TIME_CHANGE',
  GROUP_EXPAND_CHANGE='GROUP_EXPAND_CHANGE',
  GROUP_CHANGE='GROUP_CHANGE',
  GROUPS_CHANGE='GROUPS_CHANGE',
  SHOW_CHANGE='SHOW_CHANGE'
}

export interface GanttBusEventsInterface {
  [GanttBusEvents.HISTORY_PUSH]:(operation: OperationInterface)=>void,
  [GanttBusEvents.GROUP_HEIGHT_CHANGE]: (data: {groupId: GroupId})=> void,
  [GanttBusEvents.GROUP_BARS_HEIGHT_CHANGE]: (data: {groupId: GroupId})=> void,
  [GanttBusEvents.GROUP_ATTACHED_BARS_HEIGHT_CHANGE]: (data: {groupId: GroupId})=> void,
  [GanttBusEvents.GROUP_TOP_CHANGE]: (groupIds: GroupId[])=> void,
  [GanttBusEvents.GROUP_OVERLAP_CHANGE]:(data:{
    groupId: GroupId,
    barId?: BarId
  })=>void,
  [GanttBusEvents.BARS_CHANGE]:()=>void,
  [GanttBusEvents.LINKS_CHANGE]:()=>void,
  [GanttBusEvents.BAR_CONTEXT_MENU_ENABLE_CHANGE]:(barIds:BarId[])=>void,
  [GanttBusEvents.BAR_REMOVE]: (barIds: BarId[]) => void,
  [GanttBusEvents.BAR_CHANGE]: (barIds: BarId[]) => void,
  [GanttBusEvents.BAR_SELECTED_CHANGE]: (barIds: BarId[]) => void,
  [GanttBusEvents.WORK_TIME_CHANGE]: (workTimeIds: WorkTimeId[])=>void,
  [GanttBusEvents.GROUP_EXPAND_CHANGE]: (data:{groupId: GroupId, newValue: boolean, oldValue: boolean})=>void,
  [GanttBusEvents.GROUP_CHANGE]: (groupIds: GroupId[])=>void,
  [GanttBusEvents.GROUPS_CHANGE]: (data: { oldGroupIds: GroupId[]; newGroupIds: GroupId[]; addGroupIds: GroupId[]; deleteGroupIds: GroupId[] })=>void,
  [GanttBusEvents.ATTACHED_BAR_CHANGE]:(barIds: AttachedBarId[])=>void,
  [GanttBusEvents.LINK_CHANGE]: (linkIds: LinkId[])=>void,
  [GanttBusEvents.SHOW_CHANGE]: ()=>void
}
