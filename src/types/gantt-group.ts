import { GanttGroup } from '@/models/gantt-group';
import { Id } from './id';
import { GanttGroupWorkTimes } from '@/models/gantt-group-work-times';
import { GanttBaseClassConstructor } from './gantt-base';

export type GanttGroupViewClassConstructor = GanttGroupClassConstructor & {
  isExpand?: boolean, 
  barOverlap?:boolean
}

export type GanttGroupClassConstructor = {
  id: Id, 
  parent?:GanttGroup | null, 
  workTimes?:GanttGroupWorkTimes,
} & GanttBaseClassConstructor;

export type GanttGroupAddParams = {
  id: Id, 
  isExpand?: boolean,
  parent?:GanttGroup | null, 
  workTimes?:GanttGroupWorkTimes,
  barOverlap?: boolean
}