import { GanttGroupClassConstructor, GanttGroupViewClassConstructor } from '@/types/gantt-group';
import { BizArray } from './biz-array';
import { GanttGroup } from './gantt-group';
import { GanttGroupView } from './gantt-group-view';

export class GanttGroups extends BizArray<GanttGroupView> {
  expandedGroups: GanttGroupView[] = [];
  add(data:GanttGroupViewClassConstructor) {
    this.push(new GanttGroupView(data));
  }

  calculateExpandedGroups() {
    const list:GanttGroupView[] = [];

    this.forEach(item => {
      if (!item.parent) {
        list.push(item);
      } else {
        let expanded = true;
        let temp = item;
        while (temp.parent && expanded) {
          expanded = expanded && this.getById(temp.parent.id)!.isExpand;
          temp = this.getById(temp.parent.id)!;
        }

        if (expanded === true) {
          list.push(item);
        }
      }
    });

    this.expandedGroups = list;
  }
}