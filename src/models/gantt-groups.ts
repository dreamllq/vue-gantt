import { GanttGroupClassConstructor, GanttGroupViewClassConstructor } from '@/types/gantt-group';
import { BizArray } from './biz-array';
import { GanttGroup } from './gantt-group';
import { GanttGroupView } from './gantt-group-view';
import { GanttBase } from './gantt-base';
import { max, min } from 'lodash';
import { GanttConfig } from './gantt-config';
import { GanttLayoutConfig } from './gantt-layout-config';
import { GanttBaseClassConstructor } from '@/types/gantt-base';
import { GanttBarView } from './gantt-bar-view';
import { BarId } from '@/types/gantt-bar';
import { GanttAttachedBarView } from './gantt-attached-bar-view';

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
    super.push(new GanttGroupView(data));
  }

  getGroupIndexByTop(top:number) {
    let index = 0;
    let tempTop = 0;
    
    while (index < this.expandedGroups.length - 1 && tempTop + this.expandedGroups[index].height < top) {
      tempTop += this.expandedGroups[index].height;
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
      top += this.expandedGroups[i].height;
    }
    return top;
  }

  getGroupIndex(group: GanttGroupView) {
    return this.expandedGroups.findIndex(item => item.id === group.id);
  }

  getGroupHeight() {
    return this.expandedGroups.reduce((acc, item) => acc + item.height, 0);
  }

  calculateExpandedGroups() {
    const list:GanttGroupView[] = [];
    const walk = (group:GanttGroupView, cb:(data: GanttGroupView)=>void) => {
      cb(group);
      if (group.isExpand) {
        group.children.forEach(item => {
          walk(this.getById(item.id)!, cb);
        });
      } else {
        group.children.forEach(item => {
          walk(this.getById(item.id)!, (data) => {
            data.isShow = false;
          });
        });
      }
    };

    this.forEach(group => {
      if (group.parent) return;
      walk(group, (data) => {
        data.isShow = true;
        list.push(data);
      });
    });

    this.expandedGroups = list;
  }

  calculate() {
    this.forEach(item => {
      item.calculate();
    });
  }
}