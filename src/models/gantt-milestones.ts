import { GanttMilestoneViewClassConstructor, MilestoneId } from '@/types/gantt-milestone';
import { BizArray } from './biz-array';
import { GanttMilestoneView } from './gantt-milestone-view';
import { GanttGroup } from './gantt-group';
import { GanttGroups } from './gantt-groups';
import { GanttMilestonesClassConstructor } from '@/types/gantt-milestones';
import { GroupId } from '@/types/gantt-group';
import { min } from 'lodash';

export class GanttMilestones extends BizArray<GanttMilestoneView> {
  groups:GanttGroups;
  
  constructor(data:GanttMilestonesClassConstructor) {
    super();
    this.groups = data.groups;
  }
  add(data:GanttMilestoneViewClassConstructor) {
    const milestone = new GanttMilestoneView(data);
    super.push(milestone);
    this.groups.getById(milestone.group.id)!.milestones.push(milestone);
  }

  removeById(id: MilestoneId): void {
    const milestone = this.getById(id);
    if (!milestone) return;
      this.groups.getById(milestone.group.id)!.milestones.removeById(id);
      super.removeById(id);
  }

  calculate() {
    this.forEach(item => item.calculate());
  }

  updateShow() {
    this.forEach(bar => {
      bar.isShow = this.groups.getById(bar.group.id)!.isShow;
    });
  }

  updateGroupExpandChangeEffectBar(changedGroupIds: GroupId[]) {
    // 计算传入折叠group中最小的index
    const groupIndex = min(changedGroupIds.map(groupId => this.groups.getGroupIndex(this.groups.getById(groupId)!)))!;
  
    // #region 计算多展示出来的group下的bar
    changedGroupIds.forEach(groupId => {
      const group = this.groups.getById(groupId)!;
      if (!group.isShow) return;
      group.milestones.forEach(milestone => {
        if (!milestone.isShow) return;
        milestone.calculate();
      });
    });
    // #endregion
  
    // #region 处理传入groupId之后的group中的bar集合
    const ids:GroupId[] = [];
    for (let i = groupIndex + 1; i < this.groups.expandedGroups.length; i++) {
      ids.push(this.groups.expandedGroups[i].id);
    }
    const milestones:GanttMilestoneView[] = [];
    ids.forEach(groupId => {
        this.groups.getById(groupId)!.milestones.forEach(milestone => milestones.push(milestone));
    });
      
    milestones.forEach(item => {
      item.calculate();
    });
    // #endregion
  
  }
    
  push(...items: GanttMilestoneView[]): number {
    throw new Error('Method not implemented.');
  }
      
  pop(): GanttMilestoneView | undefined {
    throw new Error('Method not implemented.');
  }
      
  shift(): GanttMilestoneView | undefined {
    throw new Error('Method not implemented.');
  }
      
  unshift(...items: GanttMilestoneView[]): number {
    throw new Error('Method not implemented.');
  }
      
  splice(start: number, deleteCount: number, ...items: GanttMilestoneView[]): GanttMilestoneView[] {
    throw new Error('Method not implemented.');
  }
}