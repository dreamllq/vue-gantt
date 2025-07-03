import EventEmitter from '@/utils/eventemitter';
import { GanttBars } from './gantt-bars';
import { GanttConfig } from './gantt-config';
import { GanttContainer } from './gantt-container';
import { GanttGroup } from './gantt-group';
import { GanttGroups } from './gantt-groups';
import { GanttLinks } from './gantt-links';
import { GanttScroll } from './gantt-scroll';
import { GanttGroupWorkTimes } from './gantt-group-work-times';
import { GanttGroupAddParams } from '@/types/gantt-group';
import { GanttBarAddParams } from '@/types/gantt-bar';
import { GanttLinkAddParams, GanttLinkType, LinkShowStrategy } from '@/types/gantt-link';
import { GanttClassConstructor, GanttHook, GanttJsonData, GanttJsonDataAttachedBar, GanttJsonDataBar, GanttJsonDataGroup, GanttJsonDataLink, GanttJsonDataMilestone } from '@/types/gantt';
import { GanttGroupWorkTime } from './gantt-group-work-time';
import { GanttLayoutConfig } from './gantt-layout-config';
import { Unit } from '@/types/unit';
import { SchedulingMode } from '@/types/gantt-config';
import { GanttBus } from './gantt-bus';
import { GanttAttachedBars } from './gantt-attached-bars';
import { GanttAttachedBarAddParams } from '@/types/gantt-attached-bar';
import { GanttOperationHistory } from './gantt-operation-history';
import { GanttMilestones } from './gantt-milestones';
import { GanttMilestoneAddParams } from '@/types/gantt-milestone';
import { GanttGroupWorkTimeView } from './gantt-group-work-time-view';

export class Gantt extends EventEmitter {
  hook?: GanttHook;
  container: GanttContainer = new GanttContainer();
  scroll: GanttScroll;
  layoutConfig: GanttLayoutConfig;
  config: GanttConfig;
  groups: GanttGroups;
  bars: GanttBars;
  attachedBars: GanttAttachedBars;
  links: GanttLinks;
  milestones: GanttMilestones;
  bus: GanttBus = new GanttBus();
  history: GanttOperationHistory;

  constructor(data:GanttClassConstructor) {
    super();
    this.hook = data.hook;
    this.config = data.config;
    this.layoutConfig = data.layoutConfig;
    this.history = new GanttOperationHistory({ bus: this.bus });

    this.groups = new GanttGroups({
      layoutConfig: this.layoutConfig,
      config: this.config,
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

    this.milestones = new GanttMilestones();
  }

  addGroup(data:GanttGroupAddParams) {
    this.groups.add({
      ...data,
      config: this.config,
      layoutConfig: this.layoutConfig,
      bus: this.bus
    });
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
      let workTimes: GanttGroupWorkTimes | undefined;
      if (Array.isArray(groupJson.workTimes)) {
        workTimes = new GanttGroupWorkTimes();
        groupJson.workTimes.forEach(wt => {
          workTimes!.push(new GanttGroupWorkTimeView({
            config: this.config,
            groupId: groupJson.id,
            groups: this.groups,
            start: wt.start,
            end: wt.end
          }));
        });
      }

      this.addGroup({
        id: groupJson.id,
        workTimes: workTimes,
        isExpand: groupJson.isExpand,
        barOverlap: groupJson.barOverlap
      });
    });

    groups.forEach(groupJson => {
      let parentGroup: GanttGroup | null = null;

      if (groupJson.parentId) {
        parentGroup = this.groups.getById(groupJson.parentId)!;
        this.groups.getById(groupJson.id)!.parent = parentGroup;
      }
    });

    this.groups.calculateExpandedGroups();
  }

  batchAddBar(bars:GanttJsonDataBar[]) {
    bars.forEach(barJson => {
      this.addBar({
        id: barJson.id,
        duration: barJson.duration,
        start: barJson.start,
        end: barJson.end,
        groupId: barJson.groupId,
        schedulingMode: barJson.schedulingMode ? SchedulingMode[barJson.schedulingMode] : undefined,
        draggable: barJson.draggable,
        selectable: barJson.selectable,
        contextMenuEnable: barJson.contextMenuEnable
      });
    });
  }

  batchAddAttachedBar(attachedBars: GanttJsonDataAttachedBar[]) {
    attachedBars.forEach(barJson => {
      const group = this.groups.getById(barJson.groupId);
      if (group) {
        this.addAttachedBar({
          id: barJson.id,
          start: barJson.start,
          end: barJson.end,
          group: group
        });
      }
    });
  }

  batchAddLink(links:GanttJsonDataLink[]) {
    links.forEach(linkJson => {
      this.addLink({
        id: linkJson.id,
        sourceId: linkJson.sourceId,
        targetId: linkJson.targetId,
        linkType: linkJson.linkType ? GanttLinkType[linkJson.linkType] : undefined
      });
    });
  }

  batchAddMilestone(milestones:GanttJsonDataMilestone[]) {
    milestones.forEach(milestoneJson => {
      this.addMilestone(milestoneJson);
    });
  }

  static fromJson(data: GanttJsonData) {
    console.time('gantt fromJson');
    console.time('gantt fromJson class init');
    const layoutConfig = new GanttLayoutConfig(data.layoutConfig || {});
    const config = new GanttConfig({
      layoutConfig,
      endDate: data.config.endDate,
      startDate: data.config.startDate,
      durationUnit: data.config.durationUnit ? Unit[data.config.durationUnit] : undefined,
      dataScaleUnit: data.config.dataScaleUnit ? Unit[data.config.dataScaleUnit] : undefined,
      daySplitTime: data.config.daySplitTime,
      schedulingMode: data.config.schedulingMode ? SchedulingMode[data.config.schedulingMode] : undefined,
      lazyDebounceTime: data.config.lazyDebounceTime,
      draggable: data.config.draggable,
      selectable: data.config.selectable,
      multipleSelectable: data.config.multipleSelectable,
      multipleDraggable: data.config.multipleDraggable,
      contextMenuEnable: data.config.contextMenuEnable,
      contextMenuMenus: data.config.contextMenuMenus,
      linkShowStrategy: data.config.linkShowStrategy ? LinkShowStrategy[data.config.linkShowStrategy] : undefined,
      showCurrentTimeLine: data.config.showCurrentTimeLine,
      showAttachedBars: data.config.showAttachedBars,
      dragTimeOffset: data.config.dragTimeOffset
    });
    const gantt = new Gantt({
      config,
      layoutConfig,
      hook: data.hook
    });

    gantt.batchAddGroup(data.groups);
    gantt.batchAddBar(data.bars);
    gantt.batchAddAttachedBar(data.attachedBars || []);
    gantt.batchAddLink(data.links || []);
    gantt.batchAddMilestone(data.milestones || []);
    console.timeEnd('gantt fromJson class init');

    console.time('gantt fromJson data calculate');
    console.time('gantt fromJson group data calculate');
    gantt.groups.calculateWorkTime();
    console.timeEnd('gantt fromJson group data calculate');
    console.time('gantt fromJson bar data calculate');
    gantt.bars.calculate();
    console.timeEnd('gantt fromJson bar data calculate');
    gantt.attachedBars.calculate();
    console.time('gantt fromJson link data calculate');
    gantt.links.calculate();
    console.timeEnd('gantt fromJson link data calculate');
    console.time('gantt fromJson link calculateLinkGroupMap calculate');
    gantt.links.calculateLinkGroupMap();
    console.timeEnd('gantt fromJson link calculateLinkGroupMap calculate');
    gantt.milestones.calculate();
    console.timeEnd('gantt fromJson data calculate');
    console.timeEnd('gantt fromJson');

    return gantt;
  }
}