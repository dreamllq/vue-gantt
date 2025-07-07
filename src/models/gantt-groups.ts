import { GanttGroupClassConstructor, GanttGroupViewClassConstructor, GroupId } from '@/types/gantt-group';
import { BizArray } from './biz-array';
import { GanttGroupView } from './gantt-group-view';
import { GanttConfig } from './gantt-config';
import { GanttLayoutConfig } from './gantt-layout-config';
import { GanttBus } from './gantt-bus';
import { GanttGroupsClassConstructor } from '@/types/gantt-groups';
import { GanttBusEvents } from '@/types/gantt-bus';
import { difference } from 'lodash';

export class GanttGroups extends BizArray<GanttGroupView> {
  expandedGroups: GanttGroupView[] = [];
  config: GanttConfig;
  layoutConfig: GanttLayoutConfig;
  bus: GanttBus;
  constructor(data : GanttGroupsClassConstructor) {
    super();
    this.config = data.config;
    this.layoutConfig = data.layoutConfig;
    this.bus = data.bus;

    this.bus.on(GanttBusEvents.GROUP_HEIGHT_CHANGE, (data) => {
      this.calculateEffectGroupTop(data.groupId);
    });

    this.bus.on(GanttBusEvents.GROUP_EXPAND_CHANGE, () => {
      const oldExpandedGroupIds = this.expandedGroups.map(group => group.id);
      this.calculateExpandedGroups();
      this.calculate();
      const newExpandedGroupIds = this.expandedGroups.map(group => group.id);
      
      this.bus.emit(GanttBusEvents.GROUPS_CHANGE, {
        newGroupIds: newExpandedGroupIds,
        oldGroupIds: oldExpandedGroupIds,
        addGroupIds: difference(newExpandedGroupIds, oldExpandedGroupIds),
        deleteGroupIds: difference(oldExpandedGroupIds, newExpandedGroupIds)
      });
    });
  }

  add(data:GanttGroupViewClassConstructor) {
    super.push(new GanttGroupView(data));
  }

  removeById(id: GroupId): void {
    return super.removeById(id);
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
    this.bus.emit(GanttBusEvents.SHOW_CHANGE);
  }

  calculate() {
    this.forEach(item => {
      item.calculate();
    });
  }

  calculateEffectGroupTop(groupId: GroupId) {
    const groupIndex = this.getGroupIndex(this.getById(groupId)!);
    const effectGroupIds: GroupId[] = [];
    for (let i = groupIndex + 1; i < this.expandedGroups.length; i++) {
      effectGroupIds.push(this.expandedGroups[i].id);
    }
    this.bus.emit(GanttBusEvents.GROUP_TOP_CHANGE, effectGroupIds);
  }

  // calculateWorkTime() {
  //   this.expandedGroups.filter(item => item.isShow).forEach(item => {
  //     item.workTimes.calculate();
  //   });
  // }
}