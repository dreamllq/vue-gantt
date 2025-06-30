import { GanttGroup } from '@/models/gantt-group';
import { Id } from './id';
import { GanttGroupWorkTimes } from '@/models/gantt-group-work-times';
import { GanttBaseClassConstructor } from './gantt-base';
import { GanttBus } from '@/models/gantt-bus';

export type GroupId = Id;

export type GanttGroupViewClassConstructor = GanttGroupClassConstructor & {
  isExpand?: boolean, 
  barOverlap?:boolean,
  bus:GanttBus
}

export type GanttGroupClassConstructor = {
  id: GroupId, 
  parent?:GanttGroup | null, 
  workTimes?:GanttGroupWorkTimes,
} & GanttBaseClassConstructor;

export type GanttGroupAddParams = {
  id: GroupId, 
  isExpand?: boolean,
  parent?:GanttGroup | null, 
  workTimes?:GanttGroupWorkTimes,
  barOverlap?: boolean
}