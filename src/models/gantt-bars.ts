import { BarId, GanttBarClassConstructor, GanttBarViewClassConstructor } from '@/types/gantt-bar';
import { BizArray } from './biz-array';
import { GanttBarView } from './gantt-bar-view';
import { GanttBarsClassConstructor } from '@/types/gantt-bars';
import { GanttConfig } from './gantt-config';
import { GanttLayoutConfig } from './gantt-layout-config';
import { GanttGroups } from './gantt-groups';
import { GanttBus } from './gantt-bus';
import { GanttBusEvents } from '@/types/gantt-bus';
import { max, min } from 'lodash';
import { GroupId } from '@/types/gantt-group';

export class GanttBars extends BizArray<GanttBarView> {
  config: GanttConfig;
  layoutConfig: GanttLayoutConfig;
  groups: GanttGroups;
  bus: GanttBus;
  selectedBars: BizArray<GanttBarView> = new BizArray<GanttBarView>();
  constructor(data:GanttBarsClassConstructor) {
    super();
    this.config = data.config;
    this.layoutConfig = data.layoutConfig;
    this.groups = data.groups;
    this.bus = data.bus;

    this.bus.on(GanttBusEvents.GROUP_OVERLAP_CHANGE, (data) => {
      this.calculateGroupOverlap(data);
    });

    this.bus.on(GanttBusEvents.GROUP_TOP_CHANGE, (groupIds) => {
      this.updateBarsYByGroupIds(groupIds);
    });

    this.bus.on(GanttBusEvents.GROUPS_CHANGE, (data) => {
      this.updateShow();
      const effectBarIds = this.updateGroupExpandChangeEffectBar([...data.addGroupIds, ...data.deleteGroupIds]);
      this.bus.emit(GanttBusEvents.BAR_CHANGE, effectBarIds);
    });
  }
  add(data: GanttBarViewClassConstructor) {
    const bar = new GanttBarView(data);
    super.push(bar);
    this.groups.getById(bar.group.id)!.bars.push(bar);
  }

  removeById(id: BarId): void {
    const bar = this.getById(id);
    if (!bar) return;
    this.groups.getById(bar.group.id)!.bars.removeById(id);
    if (bar.selected) {
      this.selectedBars.removeById(id);
    }
    super.removeById(id);
    bar.clearOverlap();
    this.bus.emit(GanttBusEvents.BAR_REMOVE, [id]);
    this.calculateGroupOverlap({ groupId: bar.group.id });
    this.bus.emit(GanttBusEvents.BARS_CHANGE);
  }

  updateShow() {
    this.forEach(bar => {
      bar.isShow = this.groups.getById(bar.group.id)!.isShow;
    });
  }

  calculate() {
    // this.forEach(bar => bar.calculate());
    this.groups.forEach(group => {
      group.bars.forEach(bar => {
        if (!bar.isShow) return;
        bar.resetTimeRange();
        bar.calculatePos();
        bar.clearOverlap();
        bar.calculateOverlapBarIds();
      });
      this.calculateGroupOverlap({ groupId: group.id });
    });
  }

  calculateGroupOverlap(data:{
    groupId: GroupId,
    barId?:BarId
  }) {
    const group = this.groups.getById(data.groupId)!;
    if (!group.isShow) return;
    if (group.barOverlap) return;
    this.calculateGroupBarsRowIndex(data.groupId, data.barId);
    this.updateCurrentGroupBarsPositionByRowIndex(data.groupId);
  }

  /**
   * 计算指定group下的bar的rowIndex属性
   * @param groupId 分组id
   */
  calculateGroupBarsRowIndex(groupId: GroupId, barId?: BarId) {
    const group = this.groups.getById(groupId)!;
    if (group.barOverlap) return;
    const groupBars = group.bars.toSorted((a, b) => {
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

    const changeIds:BarId[] = [];
    
    groupBars.forEach(bar => {
      const rowIndexList = bar.overlapBarIds.map(id => this.getById(id)!.rowIndex).sort((a, b) => a - b);
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
    group.calculateBarsHeight();
    group.calculateHeight();
  }

  /**
   * 根据bar的rowIndex更新指定group下的bar的位置信息-- _sy\sy属性
   * @param groupId 分组id
   */
  updateCurrentGroupBarsPositionByRowIndex(groupId: GroupId) {
    const group = this.groups.getById(groupId)!;
    if (group.barOverlap) return;
    const effectBarIds: BarId[] = [];
    const groupBars = this.groups.getById(group.id)!.bars;
    groupBars.forEach(item => {
      item.changeY();
      effectBarIds.push(item.id);
    });
    if (effectBarIds.length > 0) {
      this.bus.emit(GanttBusEvents.BAR_CHANGE, effectBarIds);
    }
  }

  updateGroupExpandChangeEffectBar(changedGroupIds: GroupId[]) {
    const effectBarIds: BarId[] = [];
    // 计算传入折叠group中最小的index
    const groupIndex = min(changedGroupIds.map(groupId => this.groups.getGroupIndex(this.groups.getById(groupId)!)))!;

    // #region 计算多展示出来的group下的bar
    changedGroupIds.forEach(groupId => {
      const group = this.groups.getById(groupId)!;
      if (!group.isShow) return;
      group.bars.forEach(bar => {
        if (!bar.isShow) return;
        bar.resetTimeRange();
        bar.calculatePos();
        bar.clearOverlap();
        bar.calculateOverlapBarIds();
        effectBarIds.push(bar.id);
      });
      this.calculateGroupOverlap({ groupId: group.id });
    });
    // #endregion

    // #region 处理传入groupId之后的group中的bar集合
    const ids:GroupId[] = [];
    for (let i = groupIndex + 1; i < this.groups.expandedGroups.length; i++) {
      ids.push(this.groups.expandedGroups[i].id);
    }
    const bars:GanttBarView[] = [];
    ids.forEach(groupId => {
      this.groups.getById(groupId)!.bars.forEach(bar => bars.push(bar));
    });
    
    bars.forEach(item => {
      item.changeY();
      effectBarIds.push(item.id);
    });
    // #endregion
    return effectBarIds;
  }

  updateBarsYByGroupIds(groupIds: GroupId[]) {
    const effectBars:GanttBarView[] = [];
    groupIds.forEach(groupId => {
      this.groups.getById(groupId)!.bars.forEach(bar => effectBars.push(bar));
    });
    effectBars.forEach(item => item.changeY());
    this.bus.emit(GanttBusEvents.BAR_CHANGE, effectBars.map(item => item.id));
  }
  
  push(...items: GanttBarView[]): number {
    throw new Error('Method not implemented.');
  }
    
  pop(): GanttBarView | undefined {
    throw new Error('Method not implemented.');
  }
    
  shift(): GanttBarView | undefined {
    throw new Error('Method not implemented.');
  }
    
  unshift(...items: GanttBarView[]): number {
    throw new Error('Method not implemented.');
  }
    
  splice(start: number, deleteCount: number, ...items: GanttBarView[]): GanttBarView[] {
    throw new Error('Method not implemented.');
  }
}