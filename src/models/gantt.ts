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
import { GanttClassConstructor, GanttJsonData } from '@/types/gantt';
import { GanttGroupWorkTime } from './gantt-group-work-time';
import { GanttLayoutConfig } from './gantt-layout-config';
import { Unit } from '@/types/unit';
import { SchedulingMode } from '@/types/gantt-config';
import { GanttBus } from './gantt-bus';

export class Gantt extends EventEmitter {
  container: GanttContainer = new GanttContainer();
  scroll: GanttScroll;
  layoutConfig: GanttLayoutConfig;
  config: GanttConfig;
  groups: GanttGroups;
  bars: GanttBars;
  links: GanttLinks = new GanttLinks();
  bus: GanttBus = new GanttBus();

  constructor(data:GanttClassConstructor) {
    super();
    this.config = data.config;
    this.layoutConfig = data.layoutConfig;

    this.groups = new GanttGroups({
      layoutConfig: this.layoutConfig,
      config: this.config
    });

    this.bars = new GanttBars({
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
  }

  addGroup(data:GanttGroupAddParams) {
    this.groups.add({
      ...data,
      config: this.config,
      layoutConfig: this.layoutConfig
    });
  }

  addBar(data: GanttBarAddParams) {
    this.bars.add({
      ...data,
      config: this.config,
      layoutConfig: this.layoutConfig,
      groups: this.groups,
      bars: this.bars,
      bus: this.bus
    });
  }

  addLink(data: GanttLinkAddParams) {
    this.links.add({
      ...data,
      config: this.config,
      layoutConfig: this.layoutConfig,
      bars: this.bars
    });
  }

  static fromJson(data: GanttJsonData) {
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
      checkable: data.config.checkable,
      multipleDraggable: data.config.multipleDraggable,
      contextMenuEnable: data.config.contextMenuEnable,
      linkShowStrategy: data.config.linkShowStrategy ? LinkShowStrategy[data.config.linkShowStrategy] : undefined
    });
    const gantt = new Gantt({
      config,
      layoutConfig 
    });

    data.groups.forEach(groupJson => {
      let parentGroup: GanttGroup | null = null;

      if (groupJson.parentId) {
        parentGroup = gantt.groups.getById(groupJson.parentId) || null;
      }
      
      let workTimes: GanttGroupWorkTimes | undefined;

      if (Array.isArray(groupJson.workTimes)) {
        workTimes = new GanttGroupWorkTimes();

        groupJson.workTimes.forEach(wt => {
          workTimes!.push(new GanttGroupWorkTime(wt));
        });
      }

      gantt.addGroup({
        id: groupJson.id,
        parent: parentGroup,
        workTimes: workTimes,
        isExpand: groupJson.isExpand,
        barOverlap: groupJson.barOverlap
      });
    });
    gantt.groups.calculateExpandedGroups();

    data.bars.forEach(barJson => {
      const group = gantt.groups.getById(barJson.groupId);
      if (group) {
        gantt.addBar({
          id: barJson.id,
          duration: barJson.duration,
          start: barJson.start,
          end: barJson.end,
          group: group,
          schedulingMode: barJson.schedulingMode ? SchedulingMode[barJson.schedulingMode] : undefined
        });
      }
    });

    data.links.forEach(linkJson => {
      const sourceBar = gantt.bars.getById(linkJson.sourceId);
      const targetBar = gantt.bars.getById(linkJson.targetId);
      if (sourceBar && targetBar) {
        gantt.addLink({
          id: linkJson.id,
          source: sourceBar,
          target: targetBar,
          linkType: linkJson.linkType ? GanttLinkType[linkJson.linkType] : undefined
        });
      }
    });
    gantt.links.calculate();
    gantt.links.calculateLinkGroupMap();

    return gantt;
  }
}