import { GanttGroups } from '@/models/gantt-groups';
import { GanttBaseClassConstructor } from './gantt-base';
import { GanttContainer } from '@/models/gantt-container';

export type GanttScrollClassConstructor = {
  groups: GanttGroups;
  container: GanttContainer
} & GanttBaseClassConstructor;