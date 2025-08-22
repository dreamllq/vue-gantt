import EventEmitter from '@/utils/eventemitter';
import { GanttBars } from './gantt-bars';
import { GanttConfig } from './gantt-config';
import { GanttContainer } from './gantt-container';
import { GanttGroup } from './gantt-group';
import { GanttGroups } from './gantt-groups';
import { GanttLinks } from './gantt-links';
import { GanttScroll } from './gantt-scroll';
import { GanttGroupAddParams } from '@/types/gantt-group';
import { GanttBarAddParams } from '@/types/gantt-bar';
import { GanttLinkAddParams, GanttLinkType, LinkShowStrategy } from '@/types/gantt-link';
import { GanttClassConstructor, GanttHook, GanttJsonData, GanttJsonDataAttachedBar, GanttJsonDataBar, GanttJsonDataGroup, GanttJsonDataLink, GanttJsonDataMilestone, GanttJsonDataWorkTime } from '@/types/gantt';
import { GanttLayoutConfig } from './gantt-layout-config';
import { Unit } from '@/types/unit';
import { SchedulingMode } from '@/types/gantt-config';
import { GanttBus } from './gantt-bus';
import { GanttAttachedBars } from './gantt-attached-bars';
import { GanttAttachedBarAddParams } from '@/types/gantt-attached-bar';
import { GanttOperationHistory } from './gantt-operation-history';
import { GanttMilestones } from './gantt-milestones';
import { GanttMilestoneAddParams } from '@/types/gantt-milestone';
import { GanttWorkTimes } from './gantt-work-times';
import { GanttWorkTimeAddParams } from '@/types/gantt-work-time';

export class Gantt extends EventEmitter {
  hook?: GanttHook;
  container: GanttContainer = new GanttContainer();
  scroll: GanttScroll;
  layoutConfig: GanttLayoutConfig;
  config: GanttConfig;
  bus: GanttBus = new GanttBus();
  history: GanttOperationHistory;
  groups: GanttGroups;
  workTimes: GanttWorkTimes;
  bars: GanttBars;
  attachedBars: GanttAttachedBars;
  links: GanttLinks;
  milestones: GanttMilestones;

  constructor(data:GanttClassConstructor) {
    super();
    this.hook = data.hook;
    this.config = data.config;
    this.layoutConfig = data.layoutConfig;
    this.history = new GanttOperationHistory({ bus: this.bus });

    this.groups = new GanttGroups({
      layoutConfig: this.layoutConfig,
      config: this.config,
      container: this.container,
      bus: this.bus
    });

    this.workTimes = new GanttWorkTimes({
      config: this.config,
      groups: this.groups,
      bus: this.bus
    });

    this.bars = new GanttBars({
      layoutConfig: this.layoutConfig,
      config: this.config,
      groups: this.groups,
      bus: this.bus
    });

    this.attachedBars = new GanttAttachedBars({
      layoutConfig: this.layoutConfig,
      config: this.config,
      groups: this.groups,
      bus: this.bus
    });

    this.scroll = new GanttScroll({
      layoutConfig: this.layoutConfig,
      config: this.config,
      container: this.container,
      groups: this.groups
    });

    this.links = new GanttLinks({
      bars: this.bars,
      bus: this.bus,
      config: this.config
    });

    this.milestones = new GanttMilestones({ groups: this.groups });
  }

  addGroup(data:GanttGroupAddParams) {
    this.groups.add({
      ...data,
      config: this.config,
      layoutConfig: this.layoutConfig,
      bus: this.bus
    });
  }

  addWorkTime(data: GanttWorkTimeAddParams) {
    const group = this.groups.getById(data.groupId);
    if (group) {
      this.workTimes.add({
        ...data,
        group,
        config: this.config,
        groups: this.groups,
        layoutConfig: this.layoutConfig
      });
    }
  }

  addBar(data: GanttBarAddParams) {
    const group = this.groups.getById(data.groupId);
    if (group) {
      this.bars.add({
        ...data,
        group: group,
        config: this.config,
        layoutConfig: this.layoutConfig,
        groups: this.groups,
        bars: this.bars,
        bus: this.bus
      });
    }
  }

  addAttachedBar(data: GanttAttachedBarAddParams) {
    this.attachedBars.add({
      ...data,
      config: this.config,
      layoutConfig: this.layoutConfig,
      groups: this.groups,
      bus: this.bus,
      attachedBars: this.attachedBars
    });
  }

  addLink(data: GanttLinkAddParams) {
    const sourceBar = this.bars.getById(data.sourceId);
    const targetBar = this.bars.getById(data.targetId);
    if (sourceBar && targetBar) {
      this.links.add({
        ...data,
        source: sourceBar,
        target: targetBar,
        config: this.config,
        layoutConfig: this.layoutConfig,
        bars: this.bars
      });
    }
  }

  addMilestone(data: GanttMilestoneAddParams) {
    const group = this.groups.getById(data.groupId);
    if (group) {
      this.milestones.add({
        ...data,
        group,
        config: this.config,
        groups: this.groups,
        layoutConfig: this.layoutConfig
      });
    }
  }

  batchAddGroup(groups:GanttJsonDataGroup[]) {
    groups.forEach(groupJson => {
      this.addGroup({ ...groupJson });
    });
    // #region 由于group的顺序不确定，不一定先加入父节点再加入子阶段，所以最后再便利一遍，更新父节点信息
    groups.forEach(groupJson => {
      if (groupJson.parentId) {
        const parentGroup = this.groups.getById(groupJson.parentId)!;
        this.groups.getById(groupJson.id)!.parent = parentGroup;
      }
    });
    // #endregion
  }

  batchAddWorkTime(workTimes: GanttJsonDataWorkTime[]) {
    workTimes.forEach(workTime => {
      this.addWorkTime({ ...workTime });
    });
  }

  batchAddBar(bars:GanttJsonDataBar[]) {
    bars.forEach(barJson => {
      this.addBar({
        ...barJson,
        schedulingMode: barJson.schedulingMode ? SchedulingMode[barJson.schedulingMode] : undefined
      });
    });
  }

  batchAddAttachedBar(attachedBars: GanttJsonDataAttachedBar[]) {
    attachedBars.forEach(barJson => {
      const group = this.groups.getById(barJson.groupId);
      if (group) {
        this.addAttachedBar({
          ...barJson,
          group: group
        });
      }
    });
  }

  batchAddLink(links:GanttJsonDataLink[]) {
    links.forEach(linkJson => {
      this.addLink({
        ...linkJson,
        linkType: linkJson.linkType ? GanttLinkType[linkJson.linkType] : undefined
      });
    });
  }

  batchAddMilestone(milestones:GanttJsonDataMilestone[]) {
    milestones.forEach(milestoneJson => {
      this.addMilestone(milestoneJson);
    });
  }

  static fromJson(data: GanttJsonData, options:{hook?:GanttHook} = {}) {
    console.time('gantt fromJson');
    console.time('gantt fromJson class init');
    const layoutConfig = new GanttLayoutConfig(data.layoutConfig || {});
    const config = new GanttConfig({
      layoutConfig,
      ...data.config,
      durationUnit: data.config.durationUnit ? Unit[data.config.durationUnit] : undefined,
      dataScaleUnit: data.config.dataScaleUnit ? Unit[data.config.dataScaleUnit] : undefined,
      schedulingMode: data.config.schedulingMode ? SchedulingMode[data.config.schedulingMode] : undefined,
      linkShowStrategy: data.config.linkShowStrategy ? LinkShowStrategy[data.config.linkShowStrategy] : undefined
    });
    const gantt = new Gantt({
      config,
      layoutConfig,
      hook: options.hook
    });

    gantt.batchAddGroup(data.groups);
    gantt.batchAddWorkTime(data.workTimes);
    gantt.batchAddBar(data.bars);
    gantt.batchAddAttachedBar(data.attachedBars || []);
    gantt.batchAddLink(data.links || []);
    gantt.batchAddMilestone(data.milestones || []);
    console.timeEnd('gantt fromJson class init');

    gantt.calculate();
    console.timeEnd('gantt fromJson');
    return gantt;
  }

  calculate() {
    console.time('gantt fromJson data calculate');
    console.time('gantt fromJson group data calculateExpandedGroups');
    this.groups.calculateExpandedGroups(false);
    // this.groups.calculate();
    console.timeEnd('gantt fromJson group data calculateExpandedGroups');
    this.bars.updateShow();
    console.time('gantt fromJson bar data calculate initX');
    this.bars.initX();
    console.timeEnd('gantt fromJson bar data calculate initX');
    console.time('gantt fromJson group data calculate initHeight');
    this.groups.initHeight();
    console.timeEnd('gantt fromJson group data calculate initHeight');
    console.time('gantt fromJson bar data calculate initY');
    this.bars.initY();
    console.timeEnd('gantt fromJson bar data calculate initY');
    this.attachedBars.updateShow();
    this.attachedBars.calculate();
    console.time('gantt fromJson workTimes data calculate');
    this.workTimes.updateShow();
    this.workTimes.calculate();
    console.timeEnd('gantt fromJson workTimes data calculate');
    console.time('gantt fromJson link data calculate');
    this.links.updateShow();
    if (this.config.linkShowStrategy === LinkShowStrategy.ALL) {
      this.links.calculate();
    }
    console.timeEnd('gantt fromJson link data calculate');
    console.time('gantt fromJson link calculateLinkGroupMap calculate');
    this.links.calculateLinkGroupMap();
    console.timeEnd('gantt fromJson link calculateLinkGroupMap calculate');
    this.milestones.updateShow();
    this.milestones.calculate();
    console.timeEnd('gantt fromJson data calculate');
  }

  toJSON():GanttJsonData {
    return {
      config: this.config.toJSON(),
      layoutConfig: this.layoutConfig.toJSON(),
      groups: this.groups.toJSON(),
      workTimes: this.workTimes.toJSON(),
      bars: this.bars.toJSON(),
      attachedBars: this.attachedBars.toJSON(),
      links: this.links.toJSON(),
      milestones: this.milestones.toJSON()
    };
  }
}