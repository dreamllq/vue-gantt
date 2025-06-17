import { GanttGroupViewClassConstructor } from '@/types/gantt-group';
import { GanttGroup } from './gantt-group';

export class GanttGroupView extends GanttGroup {
  isExpand = false;
  constructor(data: GanttGroupViewClassConstructor) {
    super(data);
    this.isExpand = data.isExpand || false;
  }
}