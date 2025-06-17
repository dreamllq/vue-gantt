import { GanttGroupClassConstructor, GanttGroupViewClassConstructor } from '@/types/gantt-group';
import { BizArray } from './biz-array';
import { GanttGroup } from './gantt-group';
import { GanttGroupView } from './gantt-group-view';

export class GanttGroups extends BizArray<GanttGroupView> {
  add(data:GanttGroupViewClassConstructor) {
    this.push(new GanttGroupView(data));
  }
}