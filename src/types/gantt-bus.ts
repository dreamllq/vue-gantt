import { Id } from './id';
export enum GanttBusEvents {
GROUP_ROWS_CHANGE='GROUP_ROWS_CHANGE',
BAR_POS_CHANGE='BAR_POS_CHANGE'
}

export interface GanttBusEventsInterface {
  [GanttBusEvents.GROUP_ROWS_CHANGE]: (data: {
    groupId: Id,
    effectGroupIds: Id[],
    effectBarIds: Id[]
  })=> void,
  [GanttBusEvents.BAR_POS_CHANGE]:(ids:Id[])=>void
}
