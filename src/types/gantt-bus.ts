import { Id } from './id';
export enum GanttBusEvents {
  GROUP_ROWS_CHANGE='GROUP_ROWS_CHANGE',
  BAR_POS_CHANGE='BAR_POS_CHANGE',
  GROUP_OVERLAP_CHANGE = 'GROUP_OVERLAP_CHANGE'
}

export interface GanttBusEventsInterface {
  [GanttBusEvents.GROUP_ROWS_CHANGE]: (data: {
    groupId: Id,
    effectGroupIds: Id[],
    effectBarIds: Id[]
  })=> void,
  [GanttBusEvents.BAR_POS_CHANGE]:(barIds:Id[])=>void,
  [GanttBusEvents.GROUP_OVERLAP_CHANGE]:(data:{
    groupId: Id,
    barId:Id
  })=>void
}
