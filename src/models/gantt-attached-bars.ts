import { AttachedBarId, GanttAttachedBarViewClassConstructor } from '@/types/gantt-attached-bar';
import { BizArray } from './biz-array';
import { GanttAttachedBarView } from './gantt-attached-bar-view';
import { GanttBus } from './gantt-bus';
import { GanttAttachedBarsClassConstructor } from '@/types/gantt-attached-bars';
import { GanttConfig } from './gantt-config';
import { GanttLayoutConfig } from './gantt-layout-config';
import { GanttGroups } from './gantt-groups';
import { GanttBusEvents } from '@/types/gantt-bus';
import { GroupId } from '@/types/gantt-group';
import { BarId } from '@/types/gantt-bar';
import { min } from 'lodash';

export class GanttAttachedBars extends BizArray<GanttAttachedBarView> {
  config: GanttConfig;
  layoutConfig: GanttLayoutConfig;
  groups: GanttGroups;
  bus: GanttBus;
  constructor(data:GanttAttachedBarsClassConstructor) {
    super();
    this.config = data.config;
    this.layoutConfig = data.layoutConfig;
    this.groups = data.groups;
    this.bus = data.bus;

    this.bus.on(GanttBusEvents.GROUP_BARS_HEIGHT_CHANGE, (data) => {
      if (!this.config.showAttachedBars) return; 
      const effectBars = this.groups.getById(data.groupId)!.attachedBars;
      if (effectBars.length > 0) {
        effectBars.forEach(bar => bar.calculate());
        this.bus.emit(GanttBusEvents.ATTACHED_BAR_POS_CHANGE, effectBars.getIds());
      }
    });
    
    this.bus.on(GanttBusEvents.GROUP_TOP_CHANGE, (groupIds) => {
      if (!this.config.showAttachedBars) return; 
      this.updateBarsYByGroupIds(groupIds);
    });
  }
  add(data: GanttAttachedBarViewClassConstructor) {
    const attachedBar = new GanttAttachedBarView(data);
    super.push(attachedBar);
    this.groups.getById(attachedBar.group.id)!.attachedBars.push(attachedBar);
  }
  
  removeById(id: AttachedBarId): void {
    const attachedBar = this.getById(id);
    if (!attachedBar) return;
    this.groups.getById(attachedBar.group.id)!.attachedBars.removeById(id);
    super.removeById(id);
  }

  updateShow() {
    this.forEach(bar => {
      bar.isShow = this.groups.getById(bar.group.id)!.isShow;
    });
  }

  calculate() {
    this.forEach(bar => bar.calculate());
  }

  updateBarsYByGroupIds(groupIds: GroupId[]) {
    const effectBars = this.filter(item => groupIds.includes(item.group.id));
    if (effectBars.length > 0) {
      effectBars.forEach(item => item.changeY());
      this.bus.emit(GanttBusEvents.ATTACHED_BAR_POS_CHANGE, effectBars.map(item => item.id));
    }
  }
  updateGroupExpandChangeEffectBar(changedGroupIds: GroupId[]) {
    // 计算传入折叠group中最小的index
    const groupIndex = min(changedGroupIds.map(groupId => this.groups.getGroupIndex(this.groups.getById(groupId)!)))!;
    
    // #region 计算多展示出来的group下的bar
    changedGroupIds.forEach(groupId => {
      const group = this.groups.getById(groupId)!;
      if (!group.isShow) return;
      group.attachedBars.forEach(bar => {
        if (!bar.isShow) return;
        bar.calculate();
      });
    });
    // #endregion

    // #region 处理传入groupId之后的group中的bar集合
    const ids:GroupId[] = [];
    for (let i = groupIndex + 1; i < this.groups.expandedGroups.length; i++) {
      ids.push(this.groups.expandedGroups[i].id);
    }
    const bars:GanttAttachedBarView[] = [];
    ids.forEach(groupId => {
          this.groups.getById(groupId)!.attachedBars.forEach(bar => bars.push(bar));
    });
        
    bars.forEach(item => {
      item.changeY();
    });
    // #endregion
  }

  push(...items: GanttAttachedBarView[]): number {
    throw new Error('Method not implemented.');
  }
  
  pop(): GanttAttachedBarView | undefined {
    throw new Error('Method not implemented.');
  }
  
  shift(): GanttAttachedBarView | undefined {
    throw new Error('Method not implemented.');
  }
  
  unshift(...items: GanttAttachedBarView[]): number {
    throw new Error('Method not implemented.');
  }
  
  splice(start: number, deleteCount: number, ...items: GanttAttachedBarView[]): GanttAttachedBarView[] {
    throw new Error('Method not implemented.');
  }
}