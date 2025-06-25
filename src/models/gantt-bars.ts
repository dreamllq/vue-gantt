import { GanttBarClassConstructor, GanttBarViewClassConstructor } from '@/types/gantt-bar';
import { BizArray } from './biz-array';
import { GanttBar } from './gantt-bar';
import { GanttBarView } from './gantt-bar-view';
import { Id } from '@/types';
import { GanttBarsClassConstructor } from '@/types/gantt-bars';
import { GanttConfig } from './gantt-config';
import { GanttLayoutConfig } from './gantt-layout-config';
import { GanttGroups } from './gantt-groups';
import { GanttBus } from './gantt-bus';
import { GanttBusEvents } from '@/types/gantt-bus';
import { max, min } from 'lodash';

export class GanttBars extends BizArray<GanttBarView> {
  config: GanttConfig;
  layoutConfig: GanttLayoutConfig;
  groups: GanttGroups;
  bus: GanttBus;
  constructor(data:GanttBarsClassConstructor) {
    super();
    this.config = data.config;
    this.layoutConfig = data.layoutConfig;
    this.groups = data.groups;
    this.bus = data.bus;

    this.bus.on(GanttBusEvents.GROUP_OVERLAP_CHANGE, (data) => {
      this.calculateGroupOverlap(data);
    });
  }
  add(data: GanttBarViewClassConstructor) {
    const bar = new GanttBarView(data);
    this.push(bar);
    bar.calculate();
  }

  calculate() {
    this.forEach(item => item.calculate());
  }

  calculateGroupOverlap(data:{
    groupId: Id,
    barId?:Id
  }) {
    const group = this.groups.getById(data.groupId)!;
    if (group.barOverlap) return;
    this.calculateGroupBarsRowIndex(data.groupId, data.barId);
    this.updateCurrentAndAfterGroupBarsPositionByRowIndex(data.groupId);
  }

  /**
   * 计算指定group下的bar的rowIndex属性
   * @param groupId 分组id
   */
  calculateGroupBarsRowIndex(groupId: Id, barId?: Id) {
    const group = this.groups.getById(groupId)!;
    if (group.barOverlap) return;
    const groupBars = this.filter(item => item.group.id === groupId).toSorted((a, b) => {
      if (a.rowIndex < b.rowIndex) {
        return -1;
      } else if (a.rowIndex > b.rowIndex) {
        return 1;
      } else {
        if (a.id === barId) {
          return -1;
        } else if (b.id === barId) {
          return 1;
        } else {
          return 0;
        }
      }
    });
    groupBars.forEach(item => {
      if (item.id !== barId) {
        item.rowIndex++;
      }
    });

    const changeIds:Id[] = [];
    
    groupBars.forEach(bar => {
      const rowIndexList = bar.overlapBarIds.map(id => this.getById(id)!.rowIndex);
      let rowIndex = 0;
      
      while (rowIndexList.includes(rowIndex)) {
        rowIndex++;
      }
      if (bar.id === barId) {
        rowIndex = min([rowIndex, bar.rowIndex])!;
      }
      
      if (bar.rowIndex !== rowIndex) {
        bar.rowIndex = rowIndex;
        changeIds.push(bar.id);
      }
    });

    console.log(groupBars);
    
  }

  /**
   * 根据bar的rowIndex更新指定group及之后group下的bar的位置信息-- _sy\sy属性
   * @param groupId 分组id
   */
  updateCurrentAndAfterGroupBarsPositionByRowIndex(groupId: Id) {
    const group = this.groups.getById(groupId)!;
    if (group.barOverlap) return;
    const effectGroupIds:Id[] = [];
    const effectBarIds: Id[] = [];
    const groupIndex = this.groups.getGroupIndex(this.groups.getById(groupId)!);
    const groupBars = this.filter(item => item.group.id === groupId);
    groupBars.forEach(item => {
      item.changeY();
      effectBarIds.push(item.id);
    });
    const rows = max(groupBars.map(item => item.rowIndex + 1)) || 1;
    if (group.rows !== rows) {
      group.rows = rows;
      const ids:Id[] = [];
      for (let i = groupIndex + 1; i < this.groups.expandedGroups.length; i++) {
        ids.push(this.groups.expandedGroups[i].id);
        effectGroupIds.push(this.groups.expandedGroups[i].id);
      }
      const bars = this.filter(item => ids.includes(item.group.id));
      bars.forEach(item => {
        item.changeY();
        effectBarIds.push(item.id);
      });
    }

    this.bus.emit(GanttBusEvents.GROUP_ROWS_CHANGE, {
      groupId: group.id,
      effectGroupIds: effectGroupIds,
      effectBarIds: effectBarIds
    });
  }
}