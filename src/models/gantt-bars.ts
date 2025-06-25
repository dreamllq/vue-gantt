import { GanttBarClassConstructor, GanttBarViewClassConstructor } from '@/types/gantt-bar';
import { BizArray } from './biz-array';
import { GanttBar } from './gantt-bar';
import { GanttBarView } from './gantt-bar-view';
import { Id } from '@/types';
import { GanttBarsClassConstructor } from '@/types/gantt-bars';
import { GanttConfig } from './gantt-config';
import { GanttLayoutConfig } from './gantt-layout-config';
import { GanttGroups } from './gantt-groups';

export class GanttBars extends BizArray<GanttBarView> {
  config: GanttConfig;
  layoutConfig: GanttLayoutConfig;
  groups: GanttGroups;
  constructor(data:GanttBarsClassConstructor) {
    super();
    this.config = data.config;
    this.layoutConfig = data.layoutConfig;
    this.groups = data.groups;
  }
  add(data: GanttBarViewClassConstructor) {
    const bar = new GanttBarView(data);
    this.push(bar);
    bar.calculate();
  }

  calculate() {
    this.forEach(item => item.calculate());
  }

  /**
   * 计算指定group下的bar的rowIndex属性
   * @param groupId 分组id
   */
  calculateGroupBarsRowIndex(groupId: Id) {
    
  }

  /**
   * 根据bar的rowIndex更新指定group及之后group下的bar的位置信息-- _sy\sy属性
   * @param groupId 分组id
   */
  updateCurrentAndAfterGroupBarsPositionByRowIndex(groupId: Id) {

  }
}