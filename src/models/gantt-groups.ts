import { GanttGroupClassConstructor, GanttGroupViewClassConstructor } from '@/types/gantt-group';
import { BizArray } from './biz-array';
import { GanttGroup } from './gantt-group';
import { GanttGroupView } from './gantt-group-view';
import { GanttBase } from './gantt-base';
import { max, min } from 'lodash';
import { GanttConfig } from './gantt-config';
import { GanttLayoutConfig } from './gantt-layout-config';
import { GanttBaseClassConstructor } from '@/types';

export class GanttGroups extends BizArray<GanttGroupView> {
  expandedGroups: GanttGroupView[] = [];
  config: GanttConfig;
  layoutConfig: GanttLayoutConfig;
  
  constructor(data : GanttBaseClassConstructor) {
    super();
    this.config = data.config;
    this.layoutConfig = data.layoutConfig;
  }
  add(data:GanttGroupViewClassConstructor) {
    this.push(new GanttGroupView(data));
  }

  getGroupIndexByTop(top:number) {
    let index = 0;
    let tempTop = 0;
    while (index < this.expandedGroups.length - 1 && tempTop + (this.expandedGroups[index].rows * this.layoutConfig.ROW_HEIGHT) < top) {
      tempTop += this.expandedGroups[index].rows * this.layoutConfig.ROW_HEIGHT;
      index++;
    }
    return index;
  }

  getGroupTopByIndex(index:number) {
    if (index >= this.expandedGroups.length || index < 0) {
      throw new Error(`getGroupTopByIndex传入index：${index}非法，最大 ${this.expandedGroups.length - 1}`);
    }
    let top = 0;
    for (let i = 0; i < index; i++) {
      top += this.expandedGroups[i].rows * this.layoutConfig.ROW_HEIGHT;
    }
    return top;
  }

  getGroupIndex(group: GanttGroupView) {
    return this.expandedGroups.findIndex(item => item.id === group.id);
  }

  getGroupHeight() {
    return this.expandedGroups.reduce((acc, item) => acc + (item.rows * this.layoutConfig.ROW_HEIGHT), 0);
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